# GLOSSIA GROUP — دوكيومنطاسيون كاملة للمشروع

هاد الفولدر فيه كلشي محتاجو AI Coder باش يبني الموقع كامل: حجز مواعيد + بيع منتجات (Pay in-store)، ديزاين بحال AliExpress، ستاك FastAPI + Next.js.

## ترتيب القراءة (خاص AI Coder يقرا بهاد الترتيب)

1. `01-architecture.md` — الستاك التقني الكامل، البنية، القاعدة ديال البيانات
2. `02-positioning-icp.md` — البراند، الزبون المستهدف (ICP)، الطون ديال الكتابة
3. `03-cro-conversion.md` — استراتيجية التحويل، الـ CRO، الإيموسيونز، الأوفرز
4. `04-design-system.md` — الديزاين سيستم، الألوان، التايبوغرافي، مبدأ "بلا سكرول طويل"
5. `05-reservation-flow.md` — فلو الحجز الكامل (تاريخ+وقت+منتجات+خلاص فالمحل)
6. `06-product-catalog.md` — بنية المنتجات، الصفحات، الكارطات بحال AliExpress
7. `07-backend-api.md` — الـ API endpoints، الموديلات، الميغراسيون
8. `08-tracking-pixels.md` — Facebook/TikTok/Snapchat Pixels + CAPI
9. `09-deployment-devops.md` — Docker، Hostinger/Easypanel، Namecheap، Env vars
10. `10-coding-rules.md` — قواعد الكود، الفولدر ستراكتشر، الكونفنسيونز

## ملخص سريع دّيال المشروع

- **البراند:** GLOSSIA GROUP — صالون حلاقة رجالية + منتجات عناية رجالية (مغرب)
- **الموديل:** حجز موعد أونلاين (تاريخ + وقت) + اختيار منتجات يزيدهم الزبون لاطلب، الخلاص يوقع **فالمحل نفسو** (Pay In-Store) — ماشي أونلاين، ماشي COD كلاسيك، ماشي Cart تقليدي
- **الديزاين:** إحساس AliExpress (كارطات، بادجات، urgency، نجوم) لكن بهوية Barbershop (Black + Brass/Gold)
- **بلا سكرول طويل:** المنتجات والخدمات كيتعرضو فـ Carousels أفقية جنب بعضياتهم، ماشي غريد طويل عمودي
- **الفرونت:** Next.js + Tailwind
- **الباكاند:** FastAPI + PostgreSQL (بلا Supabase)
- **الدپلوامو:** Docker، Hostinger VPS عبر Easypanel، دومين من Namecheap
- **الـ Tracking:** Meta Pixel + CAPI، TikTok Pixel + Events API، Snapchat Pixel + CAPI — Deferred loading + Dedup

## البرومپت اللي غادي تعطيه للـ AI Coder (فآخر الفولدر)

شوف `PROMPT-FOR-AI-CODER.md` — فيه البرومپت الجاهز اللي غادي تكوپي-پاست فـ Claude Code باش يبدا يبني.
