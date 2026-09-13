import os
import uuid
from datetime import date as date_type
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from slugify import slugify
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import AdminUser, create_access_token, get_current_admin
from app.models.booking import Booking, BookingProduct
from app.models.product import Product
from app.models.service import Service
from app.schemas.admin import (
    BookingDetailOut,
    BookingProductDetailOut,
    BookingServiceOut,
    LoginIn,
    LoginOut,
    ProductWriteIn,
    ServiceWriteIn,
    UploadOut,
)
from app.schemas.booking import BookingUpdateIn
from app.schemas.product import ProductOut
from app.schemas.service import ServiceOut

router = APIRouter()

ALLOWED_UPLOAD_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024


@router.post("/login", response_model=LoginOut)
def login(payload: LoginIn) -> LoginOut:
    if payload.username != settings.admin_username or payload.password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    token = create_access_token(username=payload.username)
    return LoginOut(access_token=token)


def _booking_to_detail(booking: Booking, services_by_id: dict, products_by_id: dict) -> BookingDetailOut:
    service_rows = [
        BookingServiceOut(
            service_id=row.service_id,
            name=services_by_id.get(row.service_id, "خدمة محذوفة"),
            price=row.price,
        )
        for row in booking.services
    ]
    product_rows = [
        BookingProductDetailOut(
            product_id=row.product_id,
            name=products_by_id.get(row.product_id, "منتوج محذوف"),
            quantity=row.quantity,
            unit_price=row.unit_price,
        )
        for row in booking.products
    ]

    return BookingDetailOut(
        id=booking.id,
        branch_id=booking.branch_id,
        client_name=booking.client_name,
        client_phone=booking.client_phone,
        note=booking.note,
        booking_date=booking.booking_date,
        booking_time=booking.booking_time,
        status=booking.status,
        total_amount=booking.total_amount,
        created_at=booking.created_at,
        services=service_rows,
        products=product_rows,
    )


@router.get("/bookings", response_model=list[BookingDetailOut])
def list_bookings(
    date: date_type | None = None,
    status: str | None = None,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[BookingDetailOut]:
    query = db.query(Booking)
    if date is not None:
        query = query.filter(Booking.booking_date == date)
    if status is not None:
        query = query.filter(Booking.status == status)
    bookings = query.order_by(Booking.booking_date.desc(), Booking.booking_time.asc()).all()

    services_by_id = {row.id: row.name for row in db.query(Service).all()}
    products_by_id = {row.id: row.name for row in db.query(Product).all()}

    return [_booking_to_detail(booking, services_by_id, products_by_id) for booking in bookings]


@router.patch("/bookings/{booking_id}", response_model=BookingDetailOut)
def update_booking(
    booking_id: UUID,
    payload: BookingUpdateIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> BookingDetailOut:
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

    services_by_id = {row.id: row.name for row in db.query(Service).all()}
    products_by_id = {row.id: row.name for row in db.query(Product).all()}
    return _booking_to_detail(booking, services_by_id, products_by_id)


def _unique_slug(db: Session, model, name: str) -> str:
    base_slug = slugify(name) or "item"
    slug = base_slug
    suffix = 1
    while db.query(model).filter(model.slug == slug).first() is not None:
        suffix += 1
        slug = f"{base_slug}-{suffix}"
    return slug


@router.post("/products", response_model=ProductOut)
def create_product(
    payload: ProductWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Product:
    product = Product(slug=_unique_slug(db, Product, payload.name), **payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: UUID,
    payload: ProductWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.model_dump().items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(
    product_id: UUID,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict[str, bool]:
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"ok": True}


@router.post("/services", response_model=ServiceOut)
def create_service(
    payload: ServiceWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Service:
    service = Service(slug=_unique_slug(db, Service, payload.name), **payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/services/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: UUID,
    payload: ServiceWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Service:
    service = db.query(Service).filter(Service.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")

    for field, value in payload.model_dump().items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


@router.delete("/services/{service_id}")
def delete_service(
    service_id: UUID,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict[str, bool]:
    service = db.query(Service).filter(Service.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")

    db.delete(service)
    db.commit()
    return {"ok": True}


@router.post("/upload", response_model=UploadOut)
def upload_image(
    file: UploadFile = File(...),
    _: AdminUser = Depends(get_current_admin),
) -> UploadOut:
    extension = os.path.splitext(file.filename or "")[1].lower()
    if extension not in ALLOWED_UPLOAD_EXTENSIONS:
        raise HTTPException(status_code=400, detail="نوع الملف غير مدعوم")

    contents = file.file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="الملف كبير بزاف (الحد الأقصى 8 ميغا)")

    os.makedirs(settings.upload_dir, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = os.path.join(settings.upload_dir, filename)
    with open(file_path, "wb") as destination:
        destination.write(contents)

    return UploadOut(url=f"/uploads/{filename}")
