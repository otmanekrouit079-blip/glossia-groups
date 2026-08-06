# Tracking & Pixels — Meta / TikTok / Snapchat

## 1) المبدأ: Web Pixel + CAPI مع Dedup

كل حدث مهم (ViewContent, AddToCart→"AddToOrder", InitiateCheckout, Purchase→"Booking Confirmed") كيتصيفط **مرتين**:
1. من الفرونت (Web Pixel) — بلا Hashing، سريع
2. من الباكاند (Conversions API / Events API) — **مع Hashing** (SHA-256) للبيانات الشخصية (phone, email إلا كاين)

نفس الـ `event_id` كيتصيفط فالجوج (Web + CAPI) باش المنصة تدير **Dedup** ومايتحسبش الحدث مرتين.

## 2) Deferred Loading (السرعة)

الپيكسلات ماكايتحملوش مع تحميل الصفحة، كايتحملو بعد:
```js
// lib/pixels/load.ts
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadMetaPixel();
      loadTikTokPixel();
      loadSnapchatPixel();
    }, 1500); // بعد ما تخلص الصفحة تتحمل بـ 1.5 ثانية
  });
}
```
أو أحسن: تحميل عند أول تفاعل (scroll/click) — `requestIdleCallback` إلا مدعوم.

## 3) Meta Pixel + CAPI

**Frontend (fbq):**
```js
fbq('track', 'ViewContent', { content_ids: [productId], value, currency: 'MAD' }, { eventID: eventId });
```

**Backend (CAPI) — Hashing إجباري:**
```python
import hashlib

def hash_field(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()

payload = {
    "data": [{
        "event_name": "Purchase",
        "event_time": int(time.time()),
        "event_id": event_id,  # نفسو اللي فالفرونت
        "action_source": "website",
        "user_data": {
            "ph": [hash_field(phone_e164)],   # الهاتف بصيغة +212XXXXXXXXX قبل الـ hash
            "client_ip_address": request_ip,
            "client_user_agent": user_agent,
            "fbc": fbc_cookie,
            "fbp": fbp_cookie,
        },
        "custom_data": {"currency": "MAD", "value": total_amount},
    }]
}
await client.post(f"https://graph.facebook.com/v19.0/{PIXEL_ID}/events", ...)
```

## 4) TikTok Pixel + Events API

⚠️ **نقطة مهمة كنفرمها:** TikTok Events API كيطلب رقم الهاتف بصيغة **E.164 مع علامة `+`** قبل الـ hashing (مثلا `+212612345678`)، ومبعد يتدار ليه SHA-256. تأكد فالكود:
```python
phone_e164 = f"+212{phone[1:]}"  # 0612345678 → +212612345678
hashed_phone = hash_field(phone_e164)
```

**Frontend:**
```js
ttq.track('CompleteRegistration', { value: total, currency: 'MAD' }, { event_id: eventId });
```

**Backend:**
```python
payload = {
    "event_source": "web",
    "event_source_id": TIKTOK_PIXEL_ID,
    "data": [{
        "event": "CompleteRegistration",
        "event_id": event_id,
        "user": {"phone_number": hashed_phone},
        "properties": {"currency": "MAD", "value": total_amount},
    }]
}
await client.post("https://business-api.tiktok.com/open_api/v1.3/event/track/", ...)
```

## 5) Snapchat Pixel + CAPI

```js
snaptr('track', 'SIGN_UP', { price: total, currency: 'MAD' }, { uuid_c1: eventId });
```

```python
payload = {
    "event_type": "SIGN_UP",
    "event_conversion_type": "WEB",
    "hashed_phone_number": hashed_phone,  # E.164 + SHA-256
    "event_id": event_id,
    "price": total_amount,
    "currency": "MAD",
}
await client.post(f"https://tr.snapchat.com/v2/conversion?pixel_id={SNAP_PIXEL_ID}", ...)
```

## 6) خريطة الأحداث (Events Mapping)

| الحدث فالموقع | Meta | TikTok | Snapchat |
|---|---|---|---|
| زيارة صفحة منتج | ViewContent | ViewContent | VIEW_CONTENT |
| زيادة للطلب (Order Drawer) | AddToCart | AddToCart | ADD_CART |
| بداية فلو الحجز | InitiateCheckout | InitiateCheckout | START_CHECKOUT |
| تأكيد الحجز (صفحة الشكر) | Purchase* | CompleteRegistration* | SIGN_UP* |

*بما أن الخلاص فالمحل ماشي أونلاين، الحدث النهائي هو "تأكيد الحجز" — كيتعامل معاه بحال Purchase فالتراكينغ (Value = المبلغ الإجمالي)، حتى إلا الفلوس مازال ماخلصاتش فعليا. هادشي عادي فحملات الـ Lead Gen/Booking، والمهم الـ Value يكون مضبوط باش الـ Algorithm يتعلم مزيان.

## 7) Env Variables (يزادو مع اللي كاينين فـ `07-backend-api.md`)

```
META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
SNAPCHAT_PIXEL_ID=
SNAPCHAT_CAPI_ACCESS_TOKEN=
```

## 8) Checklist قبل الإطلاق

- [ ] كل حدث عندو `event_id` موحّد بين Web وCAPI
- [ ] الهاتف يتدار ليه format E.164 (`+212...`) قبل الـ hash فـ TikTok/Snapchat/Meta
- [ ] الـ Pixels متأخرين (deferred) وما كايأثروش على الـ Lighthouse score
- [ ] Test Events (Meta Test Events Tool، TikTok Events Manager Test) قبل ما نطلقو الحملات
