# GLOSSIA GROUP Project

This repository contains:
- `frontend/`: Next.js 14 App Router storefront and booking flow
- `backend/`: FastAPI API for services, products, availability, bookings, and admin operations
- `docs/`: copied prompt documentation used for implementation

## Run locally

1. Create env files from examples:
   - `frontend/.env` from `frontend/.env.example`
   - `backend/.env` from `backend/.env.example`
2. Run containers:

```bash
docker compose up --build
```

Frontend: http://localhost:3000
Backend docs: http://localhost:8000/docs

## Production deployment

- Easypanel guide: `deploy/EASYPANEL-DEPLOY.md`
- Go-live checklist: `deploy/CHECKLIST.md`
- Backend env template: `deploy/backend.env.production.example`
- Frontend env template: `deploy/frontend.env.production.example`
