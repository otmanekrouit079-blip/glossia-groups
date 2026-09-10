from sqlalchemy import JSON, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class SalonState(Base):
    __tablename__ = "salon_state"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    payload: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    updated_at: Mapped[str | None] = mapped_column(String(64), nullable=True)
