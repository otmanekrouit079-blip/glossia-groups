from decimal import Decimal
from uuid import UUID

from app.schemas.common import ORMBaseModel


class ServiceOut(ORMBaseModel):
    id: UUID
    slug: str
    name: str
    description: str
    price: Decimal
    duration_minutes: int
    image_url: str
