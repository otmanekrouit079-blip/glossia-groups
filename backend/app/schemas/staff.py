from uuid import UUID

from app.schemas.common import ORMBaseModel


class StaffOut(ORMBaseModel):
    id: UUID
    name: str
    photo_url: str
    active: bool
