# الأركيتيكتير التقني — GLOSSIA GROUP

## 1) الستاك

| الجزء | التقنية | السبب |
|---|---|---|
| Frontend | **Next.js 14 (App Router)** + TypeScript | SEO مزيان (مهم للحملات + الگوگل)، سريع، Server Components |
| Styling | **Tailwind CSS** + shadcn/ui | تحكم كامل فالديزاين، خفيف، سريع البناء |
| State (Cart/Booking) | Zustand أو React Context بسيط | ماشي محتاجين Redux، الحالة بسيطة |
| Backend | **FastAPI (Python)** | سريع، async، Docs أوتوماتيك (Swagger)، سهل الـ CAPI integration |
| ORM | SQLAlchemy 2.0 + Alembic | ميغراسيون أوتوماتيكية عند الـ startup |
| Database | **PostgreSQL** (Easypanel، عندك ديجا) | DB name: `namabeauty`... لا، هنا `glossia` |
| Images | يتخزنو فـ `/static/uploads` على السيرفر أو S3-compatible (Easypanel كيدعم) | بساطة، بلا تعقيد إضافي |
| Auth (Admin) | JWT بسيط (FastAPI + python-jose) | غير المدير/الموظفين كيدخلو لداشبورد التسيير |
| Notifications | Webhook لـ Google Sheet + WhatsApp Cloud API (اختياري) | تتبع الحجوزات بسهولة |
| Deployment | Docker + Docker Compose، Hostinger VPS، Easypanel | عندك ديجا الحساب، بلا تعقيد زائد |
| Domain | Namecheap → `glossiagroup.ma` (أو الدومين اللي شريتي) | |
| API subdomain | `api.glossiagroup.ma` | |

## 2) البنية العامة (Folders)

```
glossia-project/
├── frontend/                 # Next.js app
│   ├── app/
│   │   ├── page.tsx              # الهوم بيج
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── services/page.tsx     # لائحة الخدمات (حلاقة، لحية...)
│   │   ├── services/[slug]/page.tsx  # صفحة خدمة + حجز
│   │   ├── shop/page.tsx         # لائحة المنتجات
│   │   ├── shop/[slug]/page.tsx  # صفحة منتج (بحال landing page)
│   │   ├── booking/page.tsx      # فلو الحجز الكامل
│   │   ├── order-confirmed/page.tsx  # صفحة الشكر
│   │   └── layout.tsx
│   ├── components/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── product-card/
│   │   ├── booking-widget/       # الكالوندري + اختيار الوقت
│   │   ├── order-drawer/         # بحال cart drawer، لكن "ملخص الحجز"
│   │   └── ui/                   # shadcn components
│   ├── lib/
│   │   ├── api.ts                # fetch functions للباكاند
│   │   ├── pixels/                # meta.ts, tiktok.ts, snapchat.ts
│   │   └── validators.ts         # التحقق من رقم الهاتف المغربي
│   ├── Dockerfile
│   └── .env.example
│
├── backend/                  # FastAPI app
│   ├── app/
│   │   ├── main.py               # entrypoint + startup migrations
│   │   ├── models/                # SQLAlchemy models
│   │   │   ├── service.py
│   │   │   ├── product.py
│   │   │   ├── booking.py         # الحجز (تاريخ+وقت+منتجات+خلاص)
│   │   │   ├── staff.py
│   │   │   └── settings.py
│   │   ├── schemas/               # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── services.py
│   │   │   ├── products.py
│   │   │   ├── bookings.py
│   │   │   ├── availability.py    # الأوقات المتاحة حسب اليوم
│   │   │   ├── admin.py           # داشبورد التسيير (JWT protected)
│   │   │   └── webhooks.py        # إرسال الحجز لـ Google Sheet
│   │   ├── core/
│   │   │   ├── config.py          # قراءة الـ env vars
│   │   │   └── security.py
│   │   └── alembic/                # الميغراسيون
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
└── docs/                     # هاد الفولدر لي كاين دابا
```

## 3) الموديل الأساسي ديال الداتا (مختصر)

- **Service** (خدمة): اسم، سعر، مدة (بالدقائق)، صورة، وصف
- **Product** (منتج): اسم، أوصاف الأوفرز (1/2/3 قطع)، أسعار، صور، مخزون
- **Staff** (الحلاق): اسم، الأوقات المتاحة ديالو
- **Booking** (الحجز): تاريخ، وقت، حلاق، الخدمة(ات) المختارة، المنتجات المختارة، اسم الزبون، رقم الهاتف، الحالة (فالانتظار/مؤكد/كمّل/ملغي)، **الخلاص يوقع فالمحل** (status: `pending_payment` → `paid_in_store`)
- **AvailabilitySlot**: الأوقات المتاحة لكل حلاق فكل يوم (باش الكالوندري يعرض غير الفارغين)

## 4) نقطة مهمة — الخلاص

ماشي Stripe، ماشي CMI، ماشي COD ديال التوصيل. المنطق هو:
1. الزبون كيحجز الموعد ويختار المنتجات (اختياري) اللي بغا يجيب معاه.
2. الطلب كيتسجل فالقاعدة بـ status = `awaiting_client` (فالانتظار حتى يجي الزبون).
3. الموظف/الگيرانت عندو داشبورد بسيط (`/admin`) فيه لائحة الحجوزات ديال اليوم، فيها اسم الزبون، الخدمة، المنتجات، والمبلغ الإجمالي.
4. ملي كيجي الزبون فالمحل، الموظف كيدوز عليه الطلب، يقدر **يزيد منتجات أخرى** مباشرة من الداشبورد (بحال upsell فالمحل)، ويأكد الخلاص (Cash/Card فالمحل) → status = `paid_in_store`.

هادشي كيلغي الحاجة لأي Payment Gateway فالفرونت، وكيسهل بزاف.
