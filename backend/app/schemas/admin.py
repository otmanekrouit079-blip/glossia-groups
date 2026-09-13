from datetime import date, datetime, time
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

from app.models.booking import BookingStatus
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
    image_url: str = "/images/placeholders/product.jpg"
    category: str = "hair-care"
    price_1: Decimal
    price_2: Decimal
    price_3: Decimal
    stock: int = 30
    rating: float = 4.8
    review_count: int = 100


class ServiceWriteIn(BaseModel):
    name: str
    description: str = ""
    price: Decimal
    duration_minutes: int
    image_url: str = "/images/placeholders/service.jpg"


class PackageWriteIn(BaseModel):
    name: str
    description: str = ""
    image_url: str = "/images/placeholders/package.jpg"
    price: Decimal
    service_ids: list[UUID] = []
    product_ids: list[UUID] = []


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
