# Boys Bank Monorepo

Учебный pet-проект банковской системы, реорганизованный в монорепозиторий:

```text
/
  backend/              Spring Boot Java API
  frontend/             React + Vite + TypeScript fintech dashboard
  fraudulent_checker/   FastAPI ML/LLM-like anti-fraud checker
  API_ENDPOINTS.md      Исторический API-контракт
  README.md
```

## Что внутри

- **backend**: Spring Boot 4, Spring Security JWT, JPA/H2, demo seed data, REST API для счетов, операций, профиля, карт, кредитов, вкладов, антифрода и admin.
- **frontend**: React, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod, Axios, Zustand, Lucide React, Recharts и shadcn/ui-compatible primitives (`cva`, `clsx`, `tailwind-merge`).
- **fraudulent_checker**: отдельный FastAPI-сервис `/api/v1/check`, который принимает назначение платежа, сумму и валюту и возвращает `suspicious`, `riskScore`, `reason`, `source`.

## Запуск backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend слушает `http://localhost:8080`.

Основные env-переменные backend:

| Переменная | Default | Назначение |
| --- | --- | --- |
| `SERVER_PORT` | `8080` | Порт Spring Boot |
| `DB_URL` | `jdbc:h2:mem:bankdb;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE` | JDBC URL |
| `DB_USERNAME` | `sa` | Пользователь БД |
| `DB_PASSWORD` | пусто | Пароль БД |
| `DB_DRIVER` | `org.h2.Driver` | JDBC driver |
| `JWT_SECRET` | dev-secret | Секрет JWT |
| `JWT_EXPIRATION_SECONDS` | `3600` | TTL JWT |
| `fraud.api.url` | `http://localhost:8000/api/v1/check` | URL fraudulent_checker |

CORS включен для Vite dev server: `http://localhost:5173` и `http://127.0.0.1:5173`.

## Запуск frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend слушает `http://localhost:5173` и берет backend URL из:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Проверка сборки:

```bash
npm run build
```

## Запуск fraudulent_checker

```bash
cd fraudulent_checker
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Документация FastAPI доступна на `http://localhost:8000/docs`.

## Demo users

Backend автоматически создает demo data при старте H2:

| Роль | Email | Password |
| --- | --- | --- |
| USER | `demo@boys.bank` | `password` |
| ADMIN | `admin@boys.bank` | `password` |

## Основные страницы frontend

- `/login`, `/register`
- `/dashboard`
- `/accounts`, `/accounts/:id`
- `/transactions`, `/transfers/new`
- `/cards`, `/profile`
- `/loans`, `/loans/new`
- `/deposits`, `/deposits/new`
- `/fraud`, `/fraud/transactions`
- `/admin` для роли `ADMIN`
- `/not-found`

## Backend API summary

Используется JWT: `Authorization: Bearer <token>`.

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Accounts: `GET /api/accounts`, `GET /api/accounts/{id}`, `GET /api/accounts/{id}/balance`, `POST /api/accounts`, `POST /api/accounts/{id}/top-up`, `POST /api/accounts/{id}/withdraw`
- Transactions: `GET /api/transactions`, `GET /api/transactions/history`, `GET /api/transactions/accounts/{id}`, `POST /api/transactions/transfer`
- Cards: `GET /api/cards`, `POST /api/cards`, `PATCH /api/cards/{id}/block`, `PATCH /api/cards/{id}/unblock`
- Profile: `GET /api/profile`, `PATCH /api/profile`
- Loans: `GET /api/loans`, `POST /api/loans/applications`, плюс кредитный калькулятор `GET /api/credit/estimate`
- Deposits: `GET /api/deposits`, `POST /api/deposits/applications`
- Fraud: `GET /api/fraud/transactions`, `GET /api/fraud/transactions/{id}`, `POST /api/fraud/transactions/{id}/review`, `POST /api/fraud/analyze`
- Admin: `GET /api/admin/users`, `GET /api/admin/users/{id}`, `PATCH /api/admin/users/{id}/role`

## Anti-fraud / LLM часть

`fraudulent_checker` является отдельным HTTP-сервисом. Backend обращается к нему через `FraudGatewayService` по `fraud.api.url`. Если сервис недоступен, backend применяет локальную эвристику по ключевым словам и сумме платежа, поэтому frontend остается рабочим без Python-сервиса.

Frontend показывает список подозрительных операций, risk score, причину, источник (`ml-service` или `local-heuristic`) и позволяет отметить платеж как `SAFE` или `SUSPICIOUS`.
