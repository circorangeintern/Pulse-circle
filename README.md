# Pulse-Circle / VerifyHire

**Orange Internship Program 2026**

A job verification platform that helps job seekers verify employers, read community reviews, and report suspicious job postings.

---

## 📁 Project Structure

```
Pulse-Circle/
├── backend/          # FastAPI (Python) backend API
│   ├── app/
│   │   ├── api/v1/endpoints/   # Auth, Companies, Jobs, Reviews, Reports
│   │   ├── core/               # Config, Database, Security, Dependencies
│   │   ├── models/             # SQLAlchemy models (User, Company, Job, Review, Report)
│   │   └── schemas/            # Pydantic request/response schemas
│   ├── alembic/                # Database migrations (skeleton)
│   ├── tests/                  # Test suite (empty)
│   └── run.py                  # Entry point (uvicorn on port 8000)
│
├── frontend/         # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── Components/   # Hero, Navbar, Footer, HowItWorks, Services, CTA
│   │   ├── pages/        # LandingPage, Login, Signup, Jobs
│   │   ├── App.jsx       # Routes configuration
│   │   └── main.jsx      # Entry point
│   └── vite.config.js    # Dev server with API proxy to backend
│
└── README.md
```

---

## 🚀 Getting Started

### Backend

1. Create a PostgreSQL database named `verifyhire`
2. Configure `.env` (see `backend/.env.example`)
3. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python run.py
   ```
5. API docs at `http://localhost:8000/api/docs`

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start dev server (proxies API to backend):
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173`

> **Note:** The Vite dev server proxies `/api` requests to `http://localhost:8000` (the backend), so both servers need to be running.

---

## 🛠 Tech Stack

| Layer        | Technology                              |
|-------------|-----------------------------------------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4       |
| **Backend**  | FastAPI, SQLAlchemy, PostgreSQL         |
| **Auth**     | JWT (python-jose), bcrypt (passlib)     |
| **Validation** | Pydantic v2                           |

---

## 📋 Status

### ✅ Completed
- Backend API (auth, companies, jobs, reviews, reports)
- Frontend landing page (Hero, HowItWorks, Services, CTA, Footer, Navbar)
- Login and Signup page shells
- Vite proxy configuration

### 🟡 In Progress / Empty Files
- `frontend/src/pages/Jobs.jsx` — Empty (job listing page not implemented)
- `backend/app/api/v1/endpoints/users.py` — Empty (user profile/management)
- `backend/app/api/v1/admin/dashboard.py` — Empty (admin dashboard)
- `backend/app/utils/exceptions.py` — Empty (custom exception handlers)
- `backend/alembic/versions/` — No database migrations yet
- `backend/tests/` — No tests yet
