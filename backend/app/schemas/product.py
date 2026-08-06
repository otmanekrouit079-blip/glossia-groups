from decimal import Decimal
from uuid import UUID

from app.schemas.common import ORMBaseModel


class ProductOut(ORMBaseModel):
    id: UUID
    slug: str
    name: str
    short_description: str
    long_description: str
    image_url: str
    category: str
    price_1: Decimal
    price_2: Decimal
    price_3: Decimal
    stock: int
    rating: float
    review_count: int
