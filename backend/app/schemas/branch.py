from uuid import UUID

from app.schemas.common import ORMBaseModel


class BranchOut(ORMBaseModel):
    id: UUID
    name: str
    address: str
