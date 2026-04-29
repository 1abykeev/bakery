# 🚀 Project Setup Guide — Django REST + Next.js SaaS

---

## 📁 Project Structure

```
my-saas/
├── backend/          # Django REST API
├── frontend/         # Next.js App Router
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 1. Initialize Git & GitHub Private Repo

### Create local repo first
```bash
mkdir my-saas && cd my-saas
git init
```

### Create `.gitignore` in root
```
# Python
backend/venv/
backend/__pycache__/
backend/**/__pycache__/
backend/*.pyc
backend/.env
backend/db.sqlite3

# Node
frontend/node_modules/
frontend/.next/
frontend/.env.local
frontend/.env

# Docker
*.log

# OS
.DS_Store
Thumbs.db
```

### Push to GitHub
```bash
# 1. Go to github.com → New Repository → set to Private → DO NOT initialize with README
# 2. Then run:

git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 2. Backend — Django REST Setup

### 2.1 Create virtual environment & install dependencies

```bash
cd my-saas
mkdir backend && cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip
```

### 2.2 Install packages

```bash
pip install \
  django \
  djangorestframework \
  djangorestframework-simplejwt \
  django-cors-headers \
  psycopg2-binary \
  python-dotenv \
  Pillow
```

### 2.3 Freeze requirements

```bash
pip freeze > requirements.txt
```

Your `requirements.txt` will look like:
```
django>=5.0
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
psycopg2-binary>=2.9
python-dotenv>=1.0
Pillow>=10.0
```

### 2.4 Create Django project & app

```bash
# Inside backend/ with venv active
django-admin startproject config .
python manage.py startapp users
```

### 2.5 Create `.env` file in `backend/`

```env
SECRET_KEY=your-very-secret-key-here
DEBUG=True
DATABASE_NAME=saas_db
DATABASE_USER=postgres
DATABASE_PASSWORD=1abykeev
DATABASE_HOST=db
DATABASE_PORT=5432
```

### 2.6 Backend folder structure

```
backend/
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── users/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── venv/              ← never commit this
├── manage.py
├── requirements.txt
└── .env               ← never commit this
```

---

## 3. Frontend — Next.js Setup

```bash
cd my-saas

# Create Next.js app with App Router, TypeScript, Tailwind
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd frontend
```

### 3.1 Install additional packages

```bash
npm install \
  axios \
  react-hook-form \
  @hookform/resolvers \
  zod \
  js-cookie
  
npm install --save-dev @types/js-cookie
```

### 3.2 Create `.env.local` in `frontend/`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3.3 Frontend folder structure (App Router)

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← landing page
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── auth/
│   ├── lib/
│   │   ├── api.ts                ← axios instance
│   │   └── validators.ts         ← zod schemas
│   └── types/
│       └── index.ts
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 4. Docker Setup

### 4.1 `backend/Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### 4.2 `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### 4.3 `docker-compose.yml` (in root `my-saas/`)

```yaml
version: '3.9'

services:
  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_DB: saas_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    restart: always
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db

  frontend:
    build: ./frontend
    restart: always
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 5. Running the Project

### Without Docker (local dev)

**Backend:**
```bash
cd backend
source venv/bin/activate
python manage.py migrate
python manage.py runserver
# runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm run dev
# runs on http://localhost:3000
```

### With Docker
```bash
# From root my-saas/
docker-compose up --build
```

---

## 6. Push Everything to GitHub

```bash
cd my-saas

git add .
git commit -m "feat: project scaffolding — django + nextjs + docker"
git push origin main
```

---

## ✅ Checklist Before Writing Code

- [ ] `venv` is in `.gitignore`
- [ ] `node_modules` is in `.gitignore`
- [ ] `.env` and `.env.local` are in `.gitignore`
- [ ] `requirements.txt` is committed
- [ ] `package.json` and `package-lock.json` are committed
- [ ] GitHub repo is set to **Private**
- [ ] Docker runs `db` → `backend` → `frontend` in correct order

---

## 📌 Next Steps (once setup is done)

1. Configure `settings.py` — database, CORS, JWT, installed apps
2. Build `users` app — custom user model, auth endpoints
3. Build landing page in Next.js (Russian text, navbar, sign in/up)
4. Build auth flow — register, login, forgot password (code to terminal)
5. Protected dashboard route with JWT token check