import uuid
from decimal import Decimal

from sqlalchemy import Boolean, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class BookingExtra(Base):
    """Side table for booking fields added after the original bookings table
    was already deployed, so we never need an ALTER TABLE migration on it."""

    __tablename__ = "booking_extras"

    booking_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("bookings.id"), primary_key=True)
    staff_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("staff.id"), nullable=True)
    coupon_code: Mapped[str] = mapped_column(String(40), default="")
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    confirmation_code: Mapped[str] = mapped_column(String(10), default="")
    is_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    reminder_sent: Mapped[bool] = mapped_column(Boolean, default=False)
