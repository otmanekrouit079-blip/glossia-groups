from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.coupon import Coupon
from app.schemas.coupon import CouponValidateIn, CouponValidateOut

router = APIRouter()


@router.post("/validate", response_model=CouponValidateOut)
def validate_coupon(payload: CouponValidateIn, db: Session = Depends(get_db)) -> CouponValidateOut:
    code = payload.code.strip().upper()
    if not code:
        return CouponValidateOut(valid=False, message="دخل كود صحيح")

    coupon = db.query(Coupon).filter(Coupon.code == code).first()
    if coupon is None or not coupon.active:
        return CouponValidateOut(valid=False, message="الكود ماشي صحيح")

    if coupon.max_uses > 0 and coupon.used_count >= coupon.max_uses:
        return CouponValidateOut(valid=False, message="الكود ماعادش صالح")

    return CouponValidateOut(
        valid=True,
        message="الكود صالح",
        discount_type=coupon.discount_type,
        discount_value=coupon.discount_value,
    )
