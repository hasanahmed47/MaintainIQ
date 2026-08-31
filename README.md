# MaintainIQ _ AI-Powered QR Maintenance & Asset History Platform

Track A: Advanced Full-Stack + GenAI submission. Node/Express/MongoDB backend, React/Vite frontend, Redux Toolkit, Framer Motion, OpenAI-powered AI Issue Triage.

## Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, OpenAI API, qrcode
- Frontend: React (Vite), Redux Toolkit, React Router, Framer Motion, Axios

## Setup

### Backend
```
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, OPENAI_API_KEY
npm run seed            # creates demo admin/technician + 3 demo assets
npm run dev              # starts on http://localhost:5000
```

### Frontend
```
cd frontend
npm install
npm run dev              # starts on http://localhost:5173
```
Optional: `cp .env.example .env` to set `VITE_API_URL` (defaults to `http://localhost:5000/api`) and `VITE_GOOGLE_CLIENT_ID`.

## Demo Credentials
- Admin: admin@maintainiq.com / admin123
- Technician: tech@maintainiq.com / tech123

## Auth Features
- **Signup page** (`/signup`) — name, email, password + confirm, with an optional *admin access code* field.
- **Google Sign-In** — "Continue with Google" on both Login and Signup (official Google Identity Services button).
- **Persistent sessions** — login is kept in `localStorage`, so closing the tab/browser and reopening the app drops you straight into your dashboard (the stored JWT is validated against `/api/auth/me` on load and cleared cleanly when expired).
- **Role security on signup** — new users join as technicians; the `admin` role requires the `ADMIN_SIGNUP_CODE` from the server `.env` (the backend rejects self-declared admins with 403).

### Enabling Google Sign-In (optional, ~5 minutes)
1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) → *Create Credentials* → **OAuth Client ID** (type: *Web application*).
2. Add your frontend origins to *Authorized JavaScript origins* (e.g. `http://localhost:5173` and your deployed URL).
3. Put the same Client ID in both env files:
   - `backend/.env` → `GOOGLE_CLIENT_ID=...`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID=...`
4. Restart the backend and frontend. The Google button appears automatically.

Without a Client ID the app works exactly as before — the button is simply hidden, and `POST /api/auth/google` answers `501 Not Implemented` (graceful fallback).

Google accounts are verified server-side (audience + issuer + email verification against Google's tokeninfo endpoint), then found-or-created by email/Google ID — no duplicate accounts, and existing email accounts get linked automatically.


## Core Workflow Demonstrated
1. Admin registers an asset → unique asset code + QR code auto-generated.
2. Public user scans QR / opens link → safe public asset page, no login required.
3. User describes a complaint → AI Issue Triage suggests title, category, priority, causes, safe checks.
4. User reviews/edits AI suggestion before submitting.
5. Issue appears on Admin dashboard → gets assigned to a technician.
6. Technician moves the issue through Inspection → Maintenance → adds a maintenance note (required before resolution) → Resolved.
7. Asset status cascades automatically (Issue Reported → Under Inspection → Under Maintenance → Operational).
8. Full asset history timeline is preserved and viewable per asset.

## Security & Business Rules Enforced (backend, not just UI)
- JWT auth + role-based `authorize()` middleware on all admin/technician routes.
- Public routes (`/api/assets/public/:assetCode`, `/api/issues/public`) return only safe fields — no internal notes, costs, or user data.
- Issue status transitions follow a strict state machine (`VALID_ISSUE_TRANSITIONS` in `issueController.js`) — invalid jumps are rejected with a clear error.
- An issue cannot be marked Resolved without an existing maintenance log.
- Maintenance cost cannot be negative; next service date cannot precede last service date.
- Asset codes and QR mappings are immutable once created — editing name/location never breaks the QR link.
- OpenAI API key lives only in the backend `.env` — never exposed to the frontend.
- AI Triage has graceful fallback (timeout / missing key / parse failure never blocks the workflow).

## Folder Structure
```
backend/
  config/       → DB connection
  models/       → User, Asset, Issue, MaintenanceLog, AssetHistory
  middleware/    → JWT auth, role guard, error handler
  controllers/   → business logic per module
  routes/        → Express routers
  utils/         → asset code / issue number generators, QR generator, history logger
  seeder.js      → demo data
  server.js      → entry point

frontend/
  src/
    pages/       → Login, Signup, AdminDashboard, TechnicianDashboard, PublicAssetPage, AssetDetails
    components/  → assets/, issues/, maintenance/, layout/, auth/
    redux/       → auth, assets, issues slices
    services/    → axios instance
    routes/      → PrivateRoute guard
```

## Notes
- Evidence/image upload (Cloudinary) and bonus features (AWS, Docker, GitHub Actions, Redis, email, rate limiting) were scoped out to meet the 8-hour hackathon deadline. The core end-to-end workflow above is fully functional.
