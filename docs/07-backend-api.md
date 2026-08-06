# Backend API — FastAPI

## 1) بنية `main.py` (خطوط عريضة)

```python
from fastapi import FastAPI
from app.core.config import settings
from app.routers import services, products, bookings, availability, admin, webhooks
from alembic.config import Config
from alembic import command

app = FastAPI(title="GLOSSIA GROUP API")

@app.on_event("startup")
async def run_migrations():
    # الميغراسيون كتخدم أوتوماتيك عند بداية الكونتينر
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

app.include_router(services.router, prefix="/api/services", tags=["services"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(availability.router, prefix="/api/availability", tags=["availability"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
```

## 2) CORS

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],  # https://glossiagroup.ma
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 3) نموذج Booking (SQLAlchemy)

```python
class Booking(Base):
    __tablename__ = "bookings"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    branch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("branches.id"))
    client_name: Mapped[str]
    client_phone: Mapped[str]        # validated: 06/07 + 8 digits
    booking_date: Mapped[date]
    booking_time: Mapped[time]
    status: Mapped[str] = mapped_column(default="pending")
    total_amount: Mapped[Decimal]
    services: Mapped[list["BookingService"]] = relationship(back_populates="booking")
    products: Mapped[list["BookingProduct"]] = relationship(back_populates="booking")
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
```

## 4) Validation ديال رقم الهاتف المغربي

```python
import re

MOROCCO_PHONE_REGEX = re.compile(r"^(06|07)[0-9]{8}$")

def validate_phone(phone: str) -> str:
    clean = phone.replace(" ", "").replace("-", "")
    if not MOROCCO_PHONE_REGEX.match(clean):
        raise ValueError("رقم الهاتف خاصو يكون مغربي صحيح (06XXXXXXXX أو 07XXXXXXXX)")
    return clean
```

## 5) Endpoint ديال Availability (الأوقات المتاحة)

```python
@router.get("/")
async def get_availability(branch_id: UUID, date: date, db: Session = Depends(get_db)):
    # كل الأوقات الممكنة (مثلا 9:00-19:00 كل 30 دقيقة)
    all_slots = generate_slots(start="09:00", end="19:00", interval_minutes=30)
    # الأوقات المحجوزة ديجا فهاد اليوم
    booked = db.query(Booking.booking_time).filter(
        Booking.branch_id == branch_id,
        Booking.booking_date == date,
        Booking.status != "cancelled"
    ).all()
    booked_times = {b[0] for b in booked}
    return [{"time": s, "available": s not in booked_times} for s in all_slots]
```

## 6) Admin Endpoints (JWT)

```python
@router.get("/bookings")
async def list_bookings(date: date | None = None, status: str | None = None,
                          current_user = Depends(get_current_admin), db: Session = Depends(get_db)):
    ...

@router.patch("/bookings/{booking_id}")
async def update_booking(booking_id: UUID, payload: BookingUpdateSchema,
                           current_user = Depends(get_current_admin), db: Session = Depends(get_db)):
    # الموظف يقدر يزيد منتجات، يبدل الحالة لـ paid_in_store
    ...
```

## 7) Webhook إرسال الحجز لـ Google Sheet

```python
import httpx

async def send_to_sheet(booking: Booking):
    payload = {
        "booking_id": str(booking.id),
        "created_at": booking.created_at.isoformat(),
        "branch": booking.branch.name,
        "client_name": booking.client_name,
        "client_phone": booking.client_phone,
        "date": booking.booking_date.isoformat(),
        "time": booking.booking_time.isoformat(),
        "services": [s.service.name for s in booking.services],
        "products": [{"name": p.product.name, "qty": p.qty, "price": float(p.price)} for p in booking.products],
        "total": float(booking.total_amount),
        "status": booking.status,
    }
    async with httpx.AsyncClient() as client:
        await client.post(settings.GOOGLE_SHEET_WEBHOOK_URL, json=payload, timeout=10)
```

يتصيفط بعد `POST /api/bookings` بنجاح (فـ background task باش مايبطئش الرسپونس).

## 8) Env Variables (Backend)

```
DATABASE_URL=postgres://glossia:glossia@glossia_database:5432/glossia?sslmode=disable
JWT_SECRET=change-me-to-a-random-secret
FRONTEND_URL=https://glossiagroup.ma
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/xxxxx/exec
META_CAPI_ACCESS_TOKEN=
META_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
SNAPCHAT_ACCESS_TOKEN=
SNAPCHAT_PIXEL_ID=
```
