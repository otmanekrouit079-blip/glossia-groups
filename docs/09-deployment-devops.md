# Deployment & DevOps

## 1) البنية العامة

- **Domain:** الدومين اللي شريتي من Namecheap → `glossiagroup.ma` (بدلو بالدومين الحقيقي)
- **API subdomain:** `api.glossiagroup.ma`
- **Hosting:** VPS Hostinger + Easypanel (عندك ديجا Postgres مثبت)
- **DB name:** `glossia`

## 2) Docker — Frontend

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

## 3) Docker — Backend

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 4) `docker-compose.yml` (للتجربة المحلية، Easypanel كيدير الديپلوامو بطريقتو)

```yaml
version: "3.9"
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    env_file: ./frontend/.env
  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: ./backend/.env
```

## 5) Easypanel — خطوات النشر

1. **Backend service:**
   - New App → Docker → ربط الـ repo GitHub، فولدر `backend/`
   - زيد الـ Env vars (شوف `.env.example`)
   - Domain: `api.glossiagroup.ma` (SSL أوتوماتيك من Easypanel)
   - تأكد `DATABASE_URL` كيشير لنفس الـ Postgres service اللي عندك ديجا (`glossia_database`)

2. **Frontend service:**
   - New App → Docker → فولدر `frontend/`
   - Domain: `glossiagroup.ma` + `www.glossiagroup.ma`
   - Env var `NEXT_PUBLIC_API_URL=https://api.glossiagroup.ma`

3. **Namecheap DNS:**
   - `A record` لـ `@` → IP ديال Hostinger VPS
   - `A record` لـ `api` → نفس الـ IP
   - `CNAME` لـ `www` → `glossiagroup.ma`

## 6) الميغراسيون الأوتوماتيكية

الميغراسيون كتخدم أوتوماتيك عند بداية الكونتينر (شوف `07-backend-api.md` — `run_migrations()` فـ `startup` event). بلا ماتحتاج تدخل يدويا للسيرفر.

## 7) `.env.example` — Frontend

```
NEXT_PUBLIC_API_URL=https://api.glossiagroup.ma
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=
```

## 8) `.env.example` — Backend

```
DATABASE_URL=postgres://glossia:glossia@glossia_database:5432/glossia?sslmode=disable
JWT_SECRET=
FRONTEND_URL=https://glossiagroup.ma
GOOGLE_SHEET_WEBHOOK_URL=
META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
SNAPCHAT_PIXEL_ID=
SNAPCHAT_CAPI_ACCESS_TOKEN=
```

## 9) Google Sheet Template — الأعمدة (CSV)

```csv
booking_id,created_at,branch,client_name,client_phone,date,time,services,products,total,status
```

خاصك تصاوب Google Apps Script بسيط يستقبل الـ Webhook (POST) ويزيد سطر جديد فالشيت — نقدر نكتب ليك السكريبت كامل إلا بغيتي فمرحلة جاية.

## 10) GitHub — بنية الـ Repo

```
glossia-project/
├── frontend/
├── backend/
├── docker-compose.yml
├── .github/workflows/ (اختياري: CI بسيط للـ lint/test)
└── docs/
```

Push لـ GitHub، مبعد Easypanel كيقدر يتصل مباشرة بالـ repo ويعاود الديپلوي أوتوماتيك عند كل push (Auto-deploy).
