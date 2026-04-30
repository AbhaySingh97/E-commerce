# LuxeCart

This repository is set up to deploy on Vercel as a single project:

- `frontend/` builds the React storefront
- `api/index.js` exposes the Express backend as a Vercel Function
- `vercel.json` routes `/api/*` to the backend and all other paths to the React SPA

## Vercel environment variables

Set these in the Vercel project before deploying:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `RAZORPAY_KEY_ID` if payments are enabled
- `RAZORPAY_KEY_SECRET` if payments are enabled
- `REACT_APP_API_URL` is optional. Leave it unset for same-origin Vercel deployments.

## Local development

- Frontend: `npm run dev --prefix frontend`
- Backend: `npm run dev --prefix backend`

## Deployment notes

- Production frontend requests default to `/api/v1`
- Development frontend requests default to `http://localhost:5000/api/v1`
- Mongo connections are cached for the serverless runtime to avoid reconnecting on every invocation
