# فلو الحجز الكامل — Reservation + Product Flow

## 1) نقطتين دخول

**أ) من صفحة خدمة** (`/services/[slug]`)
الزبون كيضغط "احجز هاد الخدمة" → كيدخل مباشرة لفلو الحجز مع الخدمة معمرة مسبقا.

**ب) من صفحة منتج** (`/shop/[slug]`)
الزبون كيضغط "زيد للطلب" (مع أوفر 1/2/3 قطع) → كيبان Order Drawer فيه المنتج + Cross-sells → كيضغط "كمّل الحجز" → كيدخل لفلو الحجز مع المنتجات معمرة مسبقا (بلا خدمة إجبارية، إلا بغا يزيد خدمة معاها اختياري).

## 2) خطوات الفلو (Step-by-step, بلا سكرول طويل — كل خطوة فـ Screen/Modal مركّز)

### الخطوة 1 — اختيار الفرع (إلا كاينين عدة فروع)
Cards بسيطة بأسماء الفروع + العنوان.

### الخطوة 2 — اختيار الخدمة (إلا مادازش مختارة)
Checkboxes/Cards للخدمات (يقدر يختار عدة: حلاقة + لحية مثلا) — المدة والسعر كيتزادو أوتوماتيك.

### الخطوة 3 — التاريخ والوقت
- Calendar أفقي (7-14 يوم جايين) — الزبون كيسكرول يمين/شمال
- Slots الوقت المتاحة كيتبدلو حسب اليوم المختار (fetch من `/api/availability?date=...&branch=...`)
- الأوقات الممتلئة معطّلة بصريا

### الخطوة 4 — منتجات إضافية (Upsell اختياري)
"بغيتي تزيد شي حاجة لطلبك؟" — Carousel صغير للمنتجات (إلا مازال ما زادش واحد من صفحة منتج)

### الخطوة 5 — المعلومات الشخصية
- الاسم الكامل (required)
- رقم الهاتف (required، validation: `^(06|07)[0-9]{8}$`) — رسالة خطأ واضحة إلا غلط
- (اختياري) ملاحظة للحلاق

### الخطوة 6 — الملخص والتأكيد
```
الفرع: [اسم الفرع]
التاريخ: الثلاثاء 12 غشت، 15:30
الخدمة(ات): حلاقة + لحية — 150 DH
المنتجات: علكة بيوتين (2 قطع) — 279 DH
─────────────────
المجموع: 429 DH
💳 الخلاص فالمحل (Cash/Card) — بلا خطر، بلا سلفة
```
زر "أكد الحجز" (Ember Red, Full width)

### الخطوة 7 — صفحة الشكر (`/order-confirmed`)
- "تم تأكيد حجزك! ✅"
- ملخص سريع + رقم الحجز
- "غادي توصلك رسالة تأكيد فـ WhatsApp/SMS" (إلا مفعّل)
- CTA ثانوي: "شارك التجربة معانا" (لينك Instagram)
- **هنا كيتصاوب الـ Pixel Event `Purchase`/`CompleteRegistration`** (شوف `08-tracking-pixels.md`)

## 3) الـ Backend — Endpoints المطلوبة

```
GET  /api/branches
GET  /api/services
GET  /api/products
GET  /api/availability?branch_id=&date=&staff_id=   → لائحة الأوقات المتاحة
POST /api/bookings                                    → خلق حجز جديد
GET  /api/bookings/{id}                                → تفاصيل حجز (لصفحة الشكر)

# Admin (JWT protected)
GET  /admin/bookings?date=&status=                     → لائحة حجوزات اليوم
PATCH /admin/bookings/{id}                              → تحديث الحالة/زيادة منتجات/تأكيد الخلاص
```

## 4) Booking States (الحالات)

```
pending        → تسجل الحجز، فالانتظار
confirmed      → تأكد (SMS/WhatsApp تصاوب)
in_store       → الزبون وصل للمحل، الموظف بدا يعامل الطلب
paid_in_store  → تم الخلاص، الحجز كمّل
cancelled      → ملغي (من الزبون أو الگيرانت)
no_show        → الزبون مجاش
```

## 5) Webhook لـ Google Sheet

عند `POST /api/bookings` (ناجح)، الباكاند كيصيفط طلب لـ Webhook URL (مخزنة فـ env var `GOOGLE_SHEET_WEBHOOK_URL`) بهاد الشكل:

```json
{
  "booking_id": "uuid",
  "created_at": "2026-08-03T14:22:00Z",
  "branch": "GLOSSIA Centre Ville",
  "client_name": "محمد العلوي",
  "client_phone": "0612345678",
  "date": "2026-08-12",
  "time": "15:30",
  "services": ["حلاقة", "لحية"],
  "products": [{"name": "علكة بيوتين", "qty": 2, "price": 279}],
  "total": 429,
  "status": "pending"
}
```

شوف `09-deployment-devops.md` للـ CSV template ديال الشيت.
