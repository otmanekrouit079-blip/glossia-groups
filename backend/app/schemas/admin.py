from datetime import date, datetime, time
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

from app.models.booking import BookingStatus
from app.models.coupon import CouponDiscountType
from app.schemas.common import ORMBaseModel


class LoginIn(BaseModel):
    username: str
    password: str


class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UploadOut(BaseModel):
    url: str


class ProductWriteIn(BaseModel):
    name: str
    short_description: str = ""
    long_description: str = ""
    image_url: str = ""
    category: str = "hair-care"
    price_1: Decimal
    price_2: Decimal
    price_3: Decimal
    stock: int = 30
    rating: float = 0.0
    review_count: int = 0


class ServiceWriteIn(BaseModel):
    name: str
    description: str = ""
    price: Decimal
    duration_minutes: int
    image_url: str = ""


class PackageWriteIn(BaseModel):
    name: str
    description: str = ""
    image_url: str = ""
    price: Decimal
    service_ids: list[UUID] = []
    product_ids: list[UUID] = []


class StaffWriteIn(BaseModel):
    name: str
    photo_url: str = ""
    active: bool = True


class CouponWriteIn(BaseModel):
    code: str
    discount_type: CouponDiscountType = CouponDiscountType.percent
    discount_value: Decimal
    active: bool = True
    max_uses: int = 0


class BookingServiceOut(BaseModel):
    service_id: UUID
    name: str
    price: Decimal


class BookingProductDetailOut(BaseModel):
    product_id: UUID
    name: str
    quantity: int
    unit_price: Decimal


class BookingDetailOut(ORMBaseModel):
    id: UUID
    branch_id: UUID
    client_name: str
    client_phone: str
    note: str
    booking_date: date
    booking_time: time
    status: BookingStatus
    total_amount: Decimal
    created_at: datetime
    services: list[BookingServiceOut] = []
    products: list[BookingProductDetailOut] = []
    staff_name: str = ""
    coupon_code: str = ""
    discount_amount: Decimal = Decimal("0.00")
    is_confirmed: bool = False
