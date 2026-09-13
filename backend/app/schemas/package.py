from decimal import Decimal
from uuid import UUID

from app.schemas.common import ORMBaseModel


class PackageOut(ORMBaseModel):
    id: UUID
    slug: str
    name: str
    description: str
    image_url: str
    price: Decimal
    service_names: list[str] = []
    product_names: list[str] = []
    service_ids: list[UUID] = []
    product_ids: list[UUID] = []
