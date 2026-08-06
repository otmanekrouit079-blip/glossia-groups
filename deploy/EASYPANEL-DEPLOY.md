# Easypanel Deployment - GLOSSIA GROUP

## 1) DNS setup (at your domain registrar)

Create these DNS records pointing to your Hostinger VPS public IP:

- A record: host `@` -> `<YOUR_VPS_IP>`
- A record: host `api` -> `<YOUR_VPS_IP>`
- CNAME record: host `www` -> `glossia.it.com`

Wait for propagation (usually 5 to 30 minutes, can be longer).

## 2) Backend app in Easypanel

- Create app from Git repository.
- App root: `backend`
- Build: use Dockerfile.
- Expose port: `8000`
- Domain: `api.glossia.it.com`
- Environment: paste values from `deploy/backend.env.production.example`

Notes:
- Set `DATABASE_URL` to your Easypanel Postgres service.
- Use DB name `glossia`.
- `JWT_SECRET` must be a long random value.

## 3) Frontend app in Easypanel

- Create app from Git repository.
- App root: `frontend`
- Build: use Dockerfile.
- Expose port: `3000`
- Domain: `glossia.it.com`
- Add second domain: `www.glossia.it.com`
- Environment: paste values from `deploy/frontend.env.production.example`

## 4) SSL

In Easypanel, enable TLS/SSL for both apps:
- `glossia.it.com`
- `www.glossia.it.com`
- `api.glossia.it.com`

## 5) CORS check

Backend `FRONTEND_URL` must be exactly:
- `https://glossia.it.com`

If you serve from www too, keep primary frontend origin as above and redirect www -> non-www (or reverse).

## 6) Smoke tests

Open:
- `https://api.glossia.it.com/health` should return `{ "status": "ok" }`
- `https://glossia.it.com` should load home page

Then test booking flow end-to-end.

## 7) Google Sheet webhook (optional)

- Publish Apps Script web app URL.
- Put URL in backend env var `GOOGLE_SHEET_WEBHOOK_URL`.
- Submit one booking and verify new row in Google Sheet.

## 8) If API is down but frontend is up

Check backend logs in Easypanel for:
- wrong `DATABASE_URL`
- missing Python dependencies
- blocked port mapping
- domain not attached to backend app
