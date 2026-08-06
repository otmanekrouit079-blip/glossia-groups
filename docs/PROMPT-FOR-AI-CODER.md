بغيتك تبني ليا موقع GLOSSIA GROUP كامل — صالون حلاقة رجالية + متجر منتجات عناية، بحجز مواعيد أونلاين والخلاص فالمحل (بلا Cart كلاسيك، بلا COD، بلا خلاص أونلاين).

قريت كاملين الملفات اللي فـ فولدر `/docs` قبل ما تبدا كود، بهاد الترتيب:
1. docs/00-README.md
2. docs/01-architecture.md
3. docs/02-positioning-icp.md
4. docs/03-cro-conversion.md
5. docs/04-design-system.md
6. docs/05-reservation-flow.md
7. docs/06-product-catalog.md
8. docs/07-backend-api.md
9. docs/08-tracking-pixels.md
10. docs/09-deployment-devops.md
11. docs/10-coding-rules.md

اتبع بالضبط الستاك المحدد (Next.js + Tailwind فالفرونت، FastAPI + PostgreSQL فالباكاند، بلا Supabase)، والألوان والتايبوغرافي اللي فـ design-system.md، والبنية ديال الفلو اللي فـ reservation-flow.md (الخلاص فالمحل، ماشي أونلاين).

خلق فولدرين منفصلين `frontend/` و `backend/` بـ Dockerfile لكل واحد، ديركتوري compose على المستوى الرئيسي، و `.env.example` لكل جزء (شوف deployment-devops.md للمتغيرات بالضبط).

زيد بيانات تجريبية (seed data) لـ 3 خدمات (حلاقة، لحية، باقة كاملة) و3 منتجات وهمية بأسماء وأسعار placeholder (1/2/3 قطع كيفما موضح فـ product-catalog.md)، مع صور placeholder (رانضيف الصور الحقيقية من بعد).

الموقع خاصو يكون بلا سكرول طويل — الخدمات والمنتجات فـ Carousels أفقية، بحال موضح فـ cro-conversion.md وdesign-system.md.

دمج Meta Pixel + CAPI، TikTok Pixel + Events API، Snapchat Pixel + CAPI بالضبط كيفما موضح فـ tracking-pixels.md (Hashing للـ CAPI، E.164 format + قبل الهاتف فـ TikTok/Snapchat، Deferred loading، Dedup بالـ event_id).

الميغراسيون (Alembic) خاصها تخدم أوتوماتيك عند بداية الكونتينر ديال الباكاند.

فآخر، صاوب ليا سكريبت Google Apps Script باش يستقبل الـ Webhook ديال الحجوزات ويزيد سطر جديد فـ Google Sheet (الأعمدة موجودة فـ deployment-devops.md)، وملف CSV template للشيت.

Push كلشي جاهز للرفع على GitHub، وجاهز للديپلوي على Easypanel (Hostinger VPS)، الدومين ديالي `glossiagroup.ma` والـ API فـ `api.glossiagroup.ma`، الـ DB name `glossia`.

ابدا بالباكاند (Models + Migrations + Seed + Endpoints)، مبعد الفرونت (Layout → Homepage → Product Page → Booking Flow → Thank You Page)، مبعد Admin Dashboard بسيط للموظفين (لائحة حجوزات اليوم + تأكيد الخلاص).
