from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.booking import Booking, BookingProduct, BookingService
from app.models.branch import Branch
from app.models.product import Product
from app.models.service import Service
from app.schemas.booking import BookingCreateIn, BookingOut
from app.services.validators import validate_morocco_phone
from app.services.webhooks import booking_to_sheet_payload, send_booking_to_sheet

router = APIRouter()


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreateIn, background_tasks: BackgroundTasks, db: Session = Depends(get_db)) -> Booking:
    try:
        phone = validate_morocco_phone(payload.client_phone)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    branch = db.query(Branch).filter(Branch.id == payload.branch_id).first()
    if branch is None:
        raise HTTPException(status_code=404, detail="Branch not found")

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

    booking.total_amount = total
    db.add(booking)
    db.commit()
    db.refresh(booking)

    sheet_payload = booking_to_sheet_payload(
        booking=booking,
        branch_name=branch.name,
        services=service_names,
        products=product_rows,
    )
    background_tasks.add_task(send_booking_to_sheet, sheet_payload)

    return booking


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: UUID, db: Session = Depends(get_db)) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking
