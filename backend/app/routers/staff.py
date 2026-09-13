from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.staff import Staff
from app.schemas.staff import StaffOut

router = APIRouter()


@router.get("/", response_model=list[StaffOut])
def list_staff(db: Session = Depends(get_db)) -> list[Staff]:
    return db.query(Staff).filter(Staff.active.is_(True)).order_by(Staff.name.asc()).all()
