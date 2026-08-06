from datetime import date, datetime, time
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.booking import BookingStatus
from app.schemas.common import ORMBaseModel


class BookingProductIn(BaseModel):
    product_id: UUID
    quantity: int = Field(ge=1, le=9)


class BookingCreateIn(BaseModel):
    branch_id: UUID
    service_ids: list[UUID] = []
    products: list[BookingProductIn] = []
    booking_date: date
    booking_time: time
    client_name: str
    client_phone: str
    note: str = ""


class BookingOut(ORMBaseModel):
    id: UUID
    branch_id: UUID
    client_name: str
    client_phone: str
    booking_date: date
    booking_time: time
    status: BookingStatus
    total_amount: Decimal
    created_at: datetime


class BookingUpdateIn(BaseModel):
    status: BookingStatus | None = None
    products: list[BookingProductIn] | None = None
