from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.salon_state import SalonState

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# Unauthenticated blob sync for the legacy salon-manager admin dashboards
# (frontend/public/admin) — mirrors their original /api/state contract.
@router.get("/state")
def get_state(db: Session = Depends(get_db)) -> dict[str, Any]:
    row = db.get(SalonState, 1)
    return {"ok": True, "payload": row.payload if row else None}


@router.put("/state")
def put_state(payload: dict[str, Any], db: Session = Depends(get_db)) -> dict[str, Any]:
    row = db.get(SalonState, 1)
    if row is None:
        row = SalonState(id=1, payload=payload)
        db.add(row)
    else:
        row.payload = payload
    row.updated_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    return {"ok": True}
