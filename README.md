# Medi Connect

A modern health booking platform that allows patients to find doctors, browse specialties, and book appointments — all in one place.

---

## Features

- **Find a Doctor** — Browse verified professionals by specialty, location, and availability
- **AI-Powered Search** — Search for doctors using natural language (e.g. "cardiologist available on weekends near downtown")
- **Easy Booking** — Select a time slot and book directly from the doctor's profile page
- **Protected Appointments** — View and manage your upcoming appointments after signing in
- **Verified Professionals** — All doctors are vetted with real credentials and patient reviews
- **24/7 Availability** — Access the platform anytime, anywhere

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5.8 | Type safety |
| Vite | 6 | Build tool |
| Tailwind CSS | v4 | Styling (via `@tailwindcss/vite`, no config file needed) |
| React Router | v7 | Client-side routing (`react-router` package) |
| Lucide React | latest | Icon library |
| Space Grotesk | — | Google Font (loaded via `<link>` in `index.html`) |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| PostgreSQL (`pg`) | Database |
| `@google/genai` | Gemini AI integration for natural language search |
| `@google-cloud/storage` | File uploads to Google Cloud Storage |
| `multer` | File upload middleware |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable management |

### Infrastructure

- **Google Cloud Run** — Two separate services (frontend + backend)
- **AlloyDB / PostgreSQL** — Managed database (see `backend/alloydb_setup.sh`)
- **Google Cloud Storage** — File and image storage

---

## Project Structure

```
medi-connect/
├── frontend/
│   ├── index.html              # App entry HTML (Space Grotesk font, title)
│   ├── vite.config.ts          # Vite config with Tailwind plugin + API proxy
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx             # Root component with routing + lazy loading
│       ├── main.tsx            # React entry point
│       ├── styles.css          # Global styles (@import "tailwindcss")
│       ├── vite-env.d.ts       # Image module declarations for TypeScript
│       ├── context/
│       │   └── AuthContext.tsx # Global auth state (signIn / signOut)
│       ├── components/
│       │   ├── Layout.tsx      # Shared navbar (logo, brand, nav links, auth)
│       │   ├── PrivateLayout.tsx # Auth guard for protected routes
│       │   └── SignInButton.tsx # Reusable sign-in button component
│       ├── pages/
│       │   ├── Home.tsx        # Public landing page with bento grid
│       │   ├── Doctors.tsx     # Doctor listing with filters + AI search
│       │   ├── DoctorDetail.tsx # Doctor profile + slot selection
│       │   ├── Appointments.tsx # Private appointments page
│       │   └── NotFound.tsx    # 404 page
│       ├── data/
│       │   └── doctors.ts      # Mock doctor data (10 doctors) + Doctor type
│       └── images/
│           ├── logo.png
│           ├── dr-women-1.png
│           └── Ellipse 5–13.png (doctor avatars)
└── backend/
    ├── package.json
    ├── tsconfig.json
    ├── Dockerfile
    ├── alloydb_setup.sh        # AlloyDB provisioning script
    └── src/
        ├── app.ts              # Express app entry + route definitions
        ├── config.ts           # Environment config with required() helper
        ├── db.ts               # PostgreSQL Pool instance
        ├── gemini.ts           # Gemini AI integration
        └── gcs.ts              # Google Cloud Storage upload helper
```

---

## Routes

| Path | Visibility | Component |
|---|---|---|
| `/` | Public | `Home` — landing page |
| `/doctors` | Public | `Doctors` — browse + filter + AI search |
| `/doctors/:id` | Public | `DoctorDetail` — profile + booking slots |
| `/appointments` | **Private** | `Appointments` — user's booked appointments |

> Private routes are guarded by `PrivateLayout`. Unauthenticated users see a friendly prompt with a **Sign In Now** button.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A PostgreSQL database (or AlloyDB instance)
- Google Cloud project with Gemini API and Cloud Storage enabled

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. API calls to `/api/*` are proxied to `http://localhost:8080`.

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=8080
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:password@host:5432/dbname
GCS_BUCKET_NAME=your_gcs_bucket
CORS_ORIGIN=http://localhost:5173
```

Then run:

```bash
npm run dev
```

---

## Mock Data

The app currently uses 10 mock doctors in `frontend/src/data/doctors.ts`. Each doctor has:

- Name, specialty, location, rating, reviews, availability
- Profile image (from `src/images/`)
- Bio, languages, education
- Booking time slots

| Doctor | Specialty |
|--------|-----------|
| Dr. Sarah Mitchell | Cardiologist |
| Dr. Omar Al-Rashid | General Practice |
| Dr. Amara Osei | Dermatologist |
| Dr. Brandon Hayes | Pediatrician |
| Dr. Carlos Reyes | Neurologist |
| Dr. Arjun Patel | Psychiatrist |
| Dr. Ashley Carter | Orthopedic Surgery |
| Dr. Marcus Webb | Ophthalmologist |
| Dr. Henry Blackwood | General Practice |
| Dr. Dariush Tehrani | Cardiologist |

---

## Pending / TODOs

- [ ] Replace mock doctor data with real `/api/doctors` backend endpoint
- [ ] Replace `mockAiSearch()` with real `/api/doctors/search?q=...` API call
- [ ] Replace in-memory `AuthContext` with a real auth provider (e.g. Firebase Auth, Google Identity Platform)
- [ ] Build out backend endpoints: `GET /api/doctors`, `GET /api/doctors/:id`, `POST /api/appointments`
- [ ] Wire "Book Appointment" button in `DoctorDetail` to POST to backend
- [ ] Build real Appointments page with booking history
- [ ] Deploy to Google Cloud Run (two services)

---

## Deployment (Google Cloud Run)

Each service is containerized with its own `Dockerfile`.

```bash
# Backend
gcloud beta run deploy medi-connect-backend \
  --source ./backend \
  --region asia-southeast1 \
  --set-env-vars GEMINI_API_KEY=...,DATABASE_URL=...,GCS_BUCKET_NAME=...

# Frontend
gcloud beta run deploy medi-connect-frontend \
  --source ./frontend \
  --region asia-southeast1
```

---

## License

MIT
