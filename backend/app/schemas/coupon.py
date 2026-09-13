from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

from app.models.coupon import CouponDiscountType
from app.schemas.common import ORMBaseModel


class CouponOut(ORMBaseModel):
    id: UUID
    code: str
    discount_type: CouponDiscountType
    discount_value: Decimal
    active: bool
    max_uses: int
    used_count: int


class CouponValidateIn(BaseModel):
    code: str


class CouponValidateOut(BaseModel):
    valid: bool
    message: str = ""
    discount_type: CouponDiscountType | None = None
    discount_value: Decimal | None = None
