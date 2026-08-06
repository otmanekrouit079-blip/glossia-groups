from __future__ import annotations

from typing import Any

import httpx

from app.core.config import settings
from app.models.booking import Booking


async def send_booking_to_sheet(payload: dict[str, Any]) -> None:
    if not settings.google_sheet_webhook_url:
        return

    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(settings.google_sheet_webhook_url, json=payload)


def booking_to_sheet_payload(booking: Booking, branch_name: str, services: list[str], products: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "booking_id": str(booking.id),
        "created_at": booking.created_at.isoformat(),
        "branch": branch_name,
        "client_name": booking.client_name,
        "client_phone": booking.client_phone,
        "date": booking.booking_date.isoformat(),
        "time": booking.booking_time.isoformat(),
        "services": services,
        "products": products,
        "total": float(booking.total_amount),
        "status": booking.status.value,
    }
