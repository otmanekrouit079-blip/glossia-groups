# قواعد الكود — Coding Rules

## عام
- TypeScript إجباري فالفرونت (`strict: true`)، Python type hints إجباري فالباكاند
- بلا `any` فالتايپسكريبت إلا فحالة نادرة موثقة
- كل Component/Function خاصو غرض واحد واضح (Single Responsibility)
- أسماء الملفات: `kebab-case` — أسماء الـ Components: `PascalCase`

## Frontend
- Server Components بالأولوية (Next.js App Router) — `"use client"` غير ملي ضروري (state, events)
- كل API call من `lib/api.ts` — ماشي fetch مباشرة جوا الـ Component
- الصور دايما عبر `next/image`
- الترجمة/النصوص العربية مركزين فـ `lib/content/` (سهل التعديل بلا ما تدخل للكود)
- Tailwind فقط — بلا CSS-in-JS إضافي

## Backend
- كل Route logic خفيف — المنطق الثقيل فـ `services/` layer منفصل عن `routers/`
- Pydantic schemas منفصلين على SQLAlchemy models (`schemas/` vs `models/`)
- كل خطأ كيرجع `HTTPException` بواضح، بلا stack trace للمستخدم
- الـ Webhooks والـ Pixel calls دايما فـ `BackgroundTasks` باش مايبطئوش الرسپونس

## قاعدة البيانات
- كل تغيير فالموديل = Alembic migration جديدة (`alembic revision --autogenerate`)
- بلا `DROP TABLE` يدوي — دايما عبر migrations قابلة للـ rollback

## الأمان
- الهاتف والاسم دايما يتصانيتايزو (sanitize) قبل التخزين
- الـ Admin routes محميين بـ JWT + role check
- الـ Env secrets ماكايدخلوش للـ Git (`.env` فـ `.gitignore`، غير `.env.example`)

## الترتيب المفضل عند بناء المشروع (خاص AI Coder يتبعو)

1. Setup الفولدرات (frontend/backend) + Docker files
2. Backend: Models + Migrations + بيانات تجريبية (seed) للخدمات/المنتجات
3. Backend: Endpoints الأساسية (services, products, availability, bookings)
4. Frontend: Layout + Header + Footer + Design System (Tailwind config بالألوان)
5. Frontend: Homepage (كل الـ Sections بالترتيب ديال `03-cro-conversion.md`)
6. Frontend: صفحة منتج كاملة (Landing style) + Order Drawer
7. Frontend: فلو الحجز كامل (Booking flow)
8. Frontend: صفحة الشكر + Pixels integration
9. Backend: Admin dashboard endpoints + Webhook لـ Sheet
10. Testing + Docker + رفع لـ GitHub + Deploy على Easypanel
