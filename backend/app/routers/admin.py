from datetime import date as date_type
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import AdminUser, get_current_admin
from app.models.booking import Booking, BookingProduct
from app.models.product import Product
from app.schemas.booking import BookingOut, BookingUpdateIn

router = APIRouter()


@router.get("/bookings", response_model=list[BookingOut])
def list_bookings(
    date: date_type | None = None,
    status: str | None = None,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[Booking]:
    query = db.query(Booking)
    if date is not None:
        query = query.filter(Booking.booking_date == date)
    if status is not None:
        query = query.filter(Booking.status == status)
    return query.order_by(Booking.booking_time.asc()).all()


@router.patch("/bookings/{booking_id}", response_model=BookingOut)
def update_booking(
    booking_id: UUID,
    payload: BookingUpdateIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    if payload.status is not None:
        booking.status = payload.status

    if payload.products is not None:
        booking.products.clear()
        products_total = Decimal("0.00")
        for item in payload.products:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product is None:
                raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
            unit_price = product.price_1 if item.quantity == 1 else product.price_2 if item.quantity == 2 else product.price_3
            booking.products.append(BookingProduct(product_id=product.id, quantity=item.quantity, unit_price=unit_price))
            products_total += unit_price

        services_total = sum(row.price for row in booking.services)
        booking.total_amount = services_total + products_total

    db.commit()
    db.refresh(booking)
    return booking
