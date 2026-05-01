# Caryqel

This repository is configured for a split deployment:

- `frontend/` deploys to Vercel as a static React SPA
- `backend/` deploys to Render as a Node web service
- `render.yaml` describes the backend service for Render Blueprints
- `vercel.json` builds the frontend and rewrites all routes to `index.html`

## Frontend deployment on Vercel

Create a Vercel project from this repository root and keep the repo-level `vercel.json`.

Set this environment variable in Vercel:

- `REACT_APP_API_URL=https://<your-render-service>.onrender.com/api/v1`

If you later attach a custom backend domain on Render, point `REACT_APP_API_URL` to that domain instead.

## Backend deployment on Render

Create the backend as a Render Web Service from this repository, or use the included `render.yaml`.

Render service settings:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Backend environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE=7d` (optional override)
- `CORS_ORIGIN=https://<your-vercel-project>.vercel.app`
- `CORS_ORIGIN_REGEX=^https://.*\.vercel\.app$` if you want Vercel preview deployments to work
- `RAZORPAY_KEY_ID` if payments are enabled
- `RAZORPAY_KEY_SECRET` if payments are enabled

For production, prefer setting `CORS_ORIGIN` to your final frontend domain. Only use a broad `CORS_ORIGIN_REGEX` if you intentionally want preview URLs to access the API.

## Local development

- Frontend: `npm run dev --prefix frontend`
- Backend: `npm run dev --prefix backend`
- Frontend local env: copy `frontend/.env.example` to `frontend/.env`
- Backend local env: copy `backend/.env.example` to `backend/.env`

## Runtime behavior

- Development frontend requests default to `http://localhost:5000/api/v1`
- Production frontend requests use `REACT_APP_API_URL` when set
- If `REACT_APP_API_URL` is unset in production, the frontend falls back to `/api/v1`
- Backend accepts exact origins from `CORS_ORIGIN` and optional regex matches from `CORS_ORIGIN_REGEX`
