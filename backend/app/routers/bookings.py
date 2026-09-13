import random
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.booking import Booking, BookingProduct, BookingService, BookingStatus
from app.models.booking_extra import BookingExtra
from app.models.branch import Branch
from app.models.coupon import Coupon, CouponDiscountType
from app.models.product import Product
from app.models.service import Service
from app.models.staff import Staff
from app.schemas.booking import BookingConfirmIn, BookingConfirmOut, BookingCreateIn, BookingCreateOut, BookingOut
from app.services.validators import validate_morocco_phone
from app.services.webhooks import booking_to_sheet_payload, send_booking_to_sheet

router = APIRouter()


def _generate_confirmation_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def _apply_coupon(db: Session, code: str, total: Decimal) -> tuple[Decimal, str]:
    normalized = code.strip().upper()
    if not normalized:
        return Decimal("0.00"), ""

    coupon = db.query(Coupon).filter(Coupon.code == normalized).first()
    if coupon is None or not coupon.active:
        raise HTTPException(status_code=400, detail="كود التخفيض ماشي صحيح")
    if coupon.max_uses > 0 and coupon.used_count >= coupon.max_uses:
        raise HTTPException(status_code=400, detail="كود التخفيض ماعادش صالح")

    if coupon.discount_type == CouponDiscountType.percent:
        discount = (total * coupon.discount_value / Decimal("100")).quantize(Decimal("0.01"))
    else:
        discount = coupon.discount_value

    discount = min(discount, total)
    coupon.used_count += 1
    return discount, normalized


@router.post("/", response_model=BookingCreateOut, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreateIn, background_tasks: BackgroundTasks, db: Session = Depends(get_db)) -> BookingCreateOut:
    try:
        phone = validate_morocco_phone(payload.client_phone)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    branch = db.query(Branch).filter(Branch.id == payload.branch_id).first()
    if branch is None:
        raise HTTPException(status_code=404, detail="Branch not found")

    if payload.staff_id is not None:
        staff = db.query(Staff).filter(Staff.id == payload.staff_id).first()
        if staff is None:
            raise HTTPException(status_code=400, detail="Staff not found")

    booking = Booking(
        branch_id=payload.branch_id,
        client_name=payload.client_name.strip(),
        client_phone=phone,
        booking_date=payload.booking_date,
        booking_time=payload.booking_time,
        note=payload.note.strip(),
    )

    total = Decimal("0.00")
    service_names: list[str] = []

    if payload.service_ids:
        services = db.query(Service).filter(Service.id.in_(payload.service_ids)).all()
        if len(services) != len(set(payload.service_ids)):
            raise HTTPException(status_code=400, detail="One or more services do not exist")
        for service in services:
            total += service.price
            service_names.append(service.name)
            booking.services.append(BookingService(service_id=service.id, price=service.price))

    product_rows: list[dict[str, str | int | float]] = []
    for item in payload.products:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product is None:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
        unit_price = product.price_1 if item.quantity == 1 else product.price_2 if item.quantity == 2 else product.price_3
        total += unit_price
        booking.products.append(
            BookingProduct(
                product_id=product.id,
                quantity=item.quantity,
                unit_price=unit_price,
            )
        )
        product_rows.append({"name": product.name, "qty": item.quantity, "price": float(unit_price)})

    discount_amount, applied_coupon = _apply_coupon(db, payload.coupon_code, total)
    total -= discount_amount

    booking.total_amount = total
    db.add(booking)
    db.flush()

    confirmation_code = _generate_confirmation_code()
    extra = BookingExtra(
        booking_id=booking.id,
        staff_id=payload.staff_id,
        coupon_code=applied_coupon,
        discount_amount=discount_amount,
        confirmation_code=confirmation_code,
        is_confirmed=False,
        reminder_sent=False,
    )
    db.add(extra)
    db.commit()
    db.refresh(booking)

    sheet_payload = booking_to_sheet_payload(
        booking=booking,
        branch_name=branch.name,
        services=service_names,
        products=product_rows,
    )
    background_tasks.add_task(send_booking_to_sheet, sheet_payload)

    # TODO: once WhatsApp Business API credentials are available, send
    # confirmation_code to payload.client_phone instead of returning it here.
    return BookingCreateOut(
        id=booking.id,
        branch_id=booking.branch_id,
        client_name=booking.client_name,
        client_phone=booking.client_phone,
        booking_date=booking.booking_date,
        booking_time=booking.booking_time,
        status=booking.status,
        total_amount=booking.total_amount,
        created_at=booking.created_at,
        discount_amount=discount_amount,
        confirmation_code=confirmation_code,
        is_confirmed=False,
    )


@router.post("/{booking_id}/confirm", response_model=BookingConfirmOut)
def confirm_booking(booking_id: UUID, payload: BookingConfirmIn, db: Session = Depends(get_db)) -> BookingConfirmOut:
    extra = db.query(BookingExtra).filter(BookingExtra.booking_id == booking_id).first()
    if extra is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    if extra.is_confirmed:
        return BookingConfirmOut(confirmed=True, message="الحجز مؤكد من قبل")

    if payload.code.strip() != extra.confirmation_code:
        raise HTTPException(status_code=400, detail="الكود ماشي صحيح")

    extra.is_confirmed = True
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is not None:
        booking.status = BookingStatus.confirmed
    db.commit()

    # TODO: once WhatsApp Business API credentials are available, send a
    # confirmation message here, and schedule the 30-minute-before reminder.
    return BookingConfirmOut(confirmed=True, message="تأكد الحجز ديالك بنجاح")


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: UUID, db: Session = Depends(get_db)) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking
