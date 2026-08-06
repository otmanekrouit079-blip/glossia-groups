from datetime import date as date_type, datetime, time, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.booking import Booking, BookingStatus

router = APIRouter()


def generate_slots(start: str = "09:00", end: str = "19:00", interval_minutes: int = 30) -> list[time]:
    current = datetime.strptime(start, "%H:%M")
    finish = datetime.strptime(end, "%H:%M")
    slots: list[time] = []
    while current <= finish:
        slots.append(current.time())
        current += timedelta(minutes=interval_minutes)
    return slots


@router.get("/")
def get_availability(branch_id: UUID, date: date_type, db: Session = Depends(get_db)) -> list[dict[str, str | bool]]:
    all_slots = generate_slots()
    booked_rows = (
        db.query(Booking.booking_time)
        .filter(Booking.branch_id == branch_id)
        .filter(Booking.booking_date == date)
        .filter(Booking.status != BookingStatus.cancelled)
        .all()
    )
    booked = {row[0] for row in booked_rows}
    return [{"time": slot.strftime("%H:%M"), "available": slot not in booked} for slot in all_slots]
