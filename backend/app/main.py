from contextlib import suppress

from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.models import Base
from app.routers import admin, availability, bookings, branches, products, services, webhooks
from app.services.seeder import seed_initial_data

app = FastAPI(title="GLOSSIA GROUP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def bootstrap() -> None:
    with suppress(Exception):
        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")

    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_initial_data(db)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(branches.router, prefix="/api/branches", tags=["branches"])
app.include_router(services.router, prefix="/api/services", tags=["services"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(availability.router, prefix="/api/availability", tags=["availability"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
