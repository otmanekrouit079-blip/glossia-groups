from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.branch import Branch
from app.schemas.branch import BranchOut

router = APIRouter()


@router.get("/", response_model=list[BranchOut])
def list_branches(db: Session = Depends(get_db)) -> list[Branch]:
    return db.query(Branch).order_by(Branch.name.asc()).all()
