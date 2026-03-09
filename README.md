# 🍞 NanBar — Bakery Management SaaS

> B2B internal management tool for bakery businesses — built with Django REST Framework + Next.js 14

---

## What is NanBar?

NanBar is a full-stack multi-tenant SaaS platform for small and medium bakery businesses in Kyrgyzstan. It replaces paper-based records with a centralized digital dashboard for managing staff, products, sales, and business analytics — all in the Kyrgyz language.

---

## Features

- **👥 Staff Management** — Add and manage employees with hourly salary rates
- **⏱️ Work Hours Tracking** — Log daily attendance with start/end times, auto-calculate hours worked and salary cost
- **📦 Products & Inventory** — Track products with ingredient cost breakdowns, live stock levels
- **🧾 Sales Recording** — Record sales with automatic stock deduction and frozen expense snapshots for accurate historical analytics
- **👤 Client Database** — Auto-built from sales data — search clients, see visit history and total spend
- **📊 Analytics Dashboard** — Revenue, production cost, salary cost, net profit — with charts and date range filtering
- **🔐 Authentication** — JWT-based login with access/refresh token rotation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 6 + Django REST Framework |
| Frontend | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL 15 |
| Auth | JWT (djangorestframework-simplejwt) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Containerization | Docker + Docker Compose |

---

## Getting Started

### Option A — With Docker (Recommended)

The easiest way. You only need **Docker Desktop** installed — no Python, Node, or PostgreSQL required.

**1. Clone the repo**
```bash
git clone https://github.com/your-username/bakery.git
cd bakery
```

**2. Create your environment file**
```bash
cp .env.example .env
```
For a demo, the default values work as-is. No changes needed.

**3. Build and run**
```bash
docker compose up --build
```

First run takes ~3-5 minutes (downloading images, building Next.js). After that it starts in ~30 seconds.

**4. Open the app**

| URL | Description |
|---|---|
| `http://localhost:3000` | Main application |
| `http://localhost:8000/admin` | Django admin panel |

Django admin login: `admin@nanbar.com` / `admin123`

---

### Option B — Local Development (Without Docker)

**Requirements:** Python 3.13, Node.js 22, PostgreSQL 15

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then set DATABASE_HOST=localhost
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local      # set NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

---

## Docker Commands

```bash
# First run / after code changes
docker compose up --build

# Normal start
docker compose up

# Run in background
docker compose up -d

# Stop (data is preserved)
docker compose down

# Stop and wipe database
docker compose down -v

# View live logs
docker compose logs -f

# View logs for one service
docker compose logs backend
docker compose logs frontend
docker compose logs db

# List running containers
docker ps

# List all images
docker images
```

---

## Project Structure

```
bakery/
├── backend/
│   ├── config/              # Django settings, URLs
│   ├── accounts/            # Custom user model + JWT auth
│   ├── bakery/              # All domain models
│   ├── staff/               # Staff management API
│   ├── products/            # Products + expenses API
│   ├── sales/               # Sales + client aggregation API
│   ├── work_hours/          # Work log API
│   ├── analytics/           # KPI analytics API
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # Axios API client + auth helpers
│   │   ├── hooks/           # useAuth hook
│   │   └── types/           # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register new account |
| POST | `/api/auth/login/` | Login, get tokens |
| GET | `/api/staff/` | List staff |
| POST | `/api/staff/` | Add staff member |
| GET | `/api/products/` | List products |
| POST | `/api/sales/` | Record a sale |
| GET | `/api/sales/clients/` | Client database |
| GET | `/api/work-hours/` | List work logs |
| POST | `/api/work-hours/` | Log work hours |
| GET | `/api/analytics/` | KPI metrics |

All endpoints except auth require `Authorization: Bearer <token>` header.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | insecure demo key |
| `DEBUG` | Django debug mode | `True` |
| `DATABASE_NAME` | PostgreSQL database name | `nanbar_db` |
| `DATABASE_USER` | PostgreSQL username | `nanbar_user` |
| `DATABASE_PASSWORD` | PostgreSQL password | `nanbar_pass` |
| `DATABASE_HOST` | DB host (`db` for Docker, `localhost` for local) | `db` |
| `DJANGO_SUPERUSER_EMAIL` | Auto-created admin email | `admin@nanbar.com` |
| `DJANGO_SUPERUSER_PASSWORD` | Auto-created admin password | `admin123` |

---

## Multi-Tenancy

Every bakery owner gets a fully isolated account. All database queries are scoped to `request.user` — one owner can never see another owner's data. Staff, products, sales, and work logs all belong to the owner who created them.

---

## License

MIT