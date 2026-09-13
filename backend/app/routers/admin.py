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
from app.models.booking_extra import BookingExtra
from app.models.coupon import Coupon
from app.models.package import Package, PackageProduct, PackageService
from app.models.product import Product
from app.models.service import Service
from app.models.staff import Staff
from app.routers.packages import _package_to_out
from app.schemas.admin import (
    BookingDetailOut,
    BookingProductDetailOut,
    BookingServiceOut,
    CouponWriteIn,
    LoginIn,
    LoginOut,
    PackageWriteIn,
    ProductWriteIn,
    ServiceWriteIn,
    StaffWriteIn,
    UploadOut,
)
from app.schemas.booking import BookingUpdateIn
from app.schemas.coupon import CouponOut
from app.schemas.package import PackageOut
from app.schemas.product import ProductOut
from app.schemas.service import ServiceOut
from app.schemas.staff import StaffOut

router = APIRouter()

ALLOWED_UPLOAD_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024


@router.post("/login", response_model=LoginOut)
def login(payload: LoginIn) -> LoginOut:
    if payload.username != settings.admin_username or payload.password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    token = create_access_token(username=payload.username)
    return LoginOut(access_token=token)


def _booking_to_detail(
    booking: Booking,
    services_by_id: dict,
    products_by_id: dict,
    extras_by_booking_id: dict,
    staff_by_id: dict,
) -> BookingDetailOut:
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

    extra = extras_by_booking_id.get(booking.id)

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
        staff_name=staff_by_id.get(extra.staff_id, "") if extra and extra.staff_id else "",
        coupon_code=extra.coupon_code if extra else "",
        discount_amount=extra.discount_amount if extra else Decimal("0.00"),
        is_confirmed=extra.is_confirmed if extra else False,
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
    extras_by_booking_id = {row.booking_id: row for row in db.query(BookingExtra).all()}
    staff_by_id = {row.id: row.name for row in db.query(Staff).all()}

    return [
        _booking_to_detail(booking, services_by_id, products_by_id, extras_by_booking_id, staff_by_id)
        for booking in bookings
    ]


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
    extras_by_booking_id = {row.booking_id: row for row in db.query(BookingExtra).all()}
    staff_by_id = {row.id: row.name for row in db.query(Staff).all()}
    return _booking_to_detail(booking, services_by_id, products_by_id, extras_by_booking_id, staff_by_id)


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


def _sync_package_links(db: Session, package: Package, service_ids: list, product_ids: list) -> None:
    db.query(PackageService).filter(PackageService.package_id == package.id).delete()
    db.query(PackageProduct).filter(PackageProduct.package_id == package.id).delete()

    for service_id in service_ids:
        db.add(PackageService(package_id=package.id, service_id=service_id))
    for product_id in product_ids:
        db.add(PackageProduct(package_id=package.id, product_id=product_id))


@router.post("/packages", response_model=PackageOut)
def create_package(
    payload: PackageWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> PackageOut:
    package = Package(
        slug=_unique_slug(db, Package, payload.name),
        name=payload.name,
        description=payload.description,
        image_url=payload.image_url,
        price=payload.price,
    )
    db.add(package)
    db.flush()
    _sync_package_links(db, package, payload.service_ids, payload.product_ids)
    db.commit()
    db.refresh(package)

    services_by_id = {row.id: row.name for row in db.query(Service).all()}
    products_by_id = {row.id: row.name for row in db.query(Product).all()}
    return _package_to_out(package, services_by_id, products_by_id)


@router.put("/packages/{package_id}", response_model=PackageOut)
def update_package(
    package_id: UUID,
    payload: PackageWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> PackageOut:
    package = db.query(Package).filter(Package.id == package_id).first()
    if package is None:
        raise HTTPException(status_code=404, detail="Package not found")

    package.name = payload.name
    package.description = payload.description
    package.image_url = payload.image_url
    package.price = payload.price
    _sync_package_links(db, package, payload.service_ids, payload.product_ids)

    db.commit()
    db.refresh(package)

    services_by_id = {row.id: row.name for row in db.query(Service).all()}
    products_by_id = {row.id: row.name for row in db.query(Product).all()}
    return _package_to_out(package, services_by_id, products_by_id)


@router.delete("/packages/{package_id}")
def delete_package(
    package_id: UUID,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict[str, bool]:
    package = db.query(Package).filter(Package.id == package_id).first()
    if package is None:
        raise HTTPException(status_code=404, detail="Package not found")

    db.delete(package)
    db.commit()
    return {"ok": True}


@router.post("/staff", response_model=StaffOut)
def create_staff(
    payload: StaffWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Staff:
    staff = Staff(**payload.model_dump())
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return staff


@router.put("/staff/{staff_id}", response_model=StaffOut)
def update_staff(
    staff_id: UUID,
    payload: StaffWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Staff:
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if staff is None:
        raise HTTPException(status_code=404, detail="Staff not found")

    for field, value in payload.model_dump().items():
        setattr(staff, field, value)

    db.commit()
    db.refresh(staff)
    return staff


@router.delete("/staff/{staff_id}")
def delete_staff(
    staff_id: UUID,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict[str, bool]:
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if staff is None:
        raise HTTPException(status_code=404, detail="Staff not found")

    db.delete(staff)
    db.commit()
    return {"ok": True}


@router.get("/coupons", response_model=list[CouponOut])
def list_coupons(
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[Coupon]:
    return db.query(Coupon).order_by(Coupon.code.asc()).all()


@router.post("/coupons", response_model=CouponOut)
def create_coupon(
    payload: CouponWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Coupon:
    code = payload.code.strip().upper()
    if db.query(Coupon).filter(Coupon.code == code).first() is not None:
        raise HTTPException(status_code=400, detail="هاد الكود مستعمل من قبل")

    coupon = Coupon(
        code=code,
        discount_type=payload.discount_type,
        discount_value=payload.discount_value,
        active=payload.active,
        max_uses=payload.max_uses,
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.put("/coupons/{coupon_id}", response_model=CouponOut)
def update_coupon(
    coupon_id: UUID,
    payload: CouponWriteIn,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Coupon:
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if coupon is None:
        raise HTTPException(status_code=404, detail="Coupon not found")

    coupon.code = payload.code.strip().upper()
    coupon.discount_type = payload.discount_type
    coupon.discount_value = payload.discount_value
    coupon.active = payload.active
    coupon.max_uses = payload.max_uses

    db.commit()
    db.refresh(coupon)
    return coupon


@router.delete("/coupons/{coupon_id}")
def delete_coupon(
    coupon_id: UUID,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict[str, bool]:
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if coupon is None:
        raise HTTPException(status_code=404, detail="Coupon not found")

    db.delete(coupon)
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
