# Deploy backend to Render with Docker

This repository contains a Spring Boot backend in `backend/`. The backend `Dockerfile` lives in `backend/Dockerfile` and builds/runs that service on Render.

## Render service settings

Create a **Web Service** on Render and select **Docker** as the runtime. Point Render to the Dockerfile inside the `backend/` directory.

Recommended settings:

- **Root Directory**: `backend`
- **Dockerfile Path**: `Dockerfile`
- **Docker Build Context Directory**: `.`
- **Health Check Path**: `/healthz`

## Environment variables

Render automatically provides `PORT` for web services. The app reads it via `server.port`, so you usually do not need to set `SERVER_PORT` manually.

Set these variables for production:

| Name | Example | Notes |
| --- | --- | --- |
| `JWT_SECRET` | `replace-with-a-random-32-plus-character-secret` | Required for signing JWTs. Must be at least 32 characters. |
| `JWT_EXPIRATION_SECONDS` | `3600` | Optional token lifetime. |
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:5432/DB_NAME` | Preferred for Render PostgreSQL. The backend converts `postgres://` / `postgresql://` URLs to a JDBC URL automatically. |
| `DB_URL` | `jdbc:postgresql://HOST:5432/DB_NAME?sslmode=require` | Optional alternative. JDBC URLs are still supported. |
| `DB_USERNAME` | `bank_user` | Optional when `DATABASE_URL` contains the username. |
| `DB_PASSWORD` | `secret` | Optional when `DATABASE_URL` contains the password. Store this only as a Render secret env var. |
| `DB_DRIVER` | `org.postgresql.Driver` | Optional when using `DATABASE_URL`; the backend sets it automatically for PostgreSQL URLs. |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.onrender.com` | Comma-separated list of frontend origins allowed to call the API. Add localhost only for local/dev use. |
| `FRAUD_API_URL` | `https://your-fraud-service.onrender.com/api/v1/check` | Optional. If omitted, the backend falls back to local fraud heuristics when the ML service is unavailable. |
| `JAVA_OPTS` | `-XX:MaxRAMPercentage=75` | Optional JVM tuning. |

For a quick first deploy without PostgreSQL, you can omit the `DATABASE_URL` / `DB_*` variables and the app will use the default in-memory H2 database. Data will not persist between restarts.

## Test Render PostgreSQL connection

For the test database you provided, set the backend web service environment variables in Render like this:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | `postgresql://boysdb_user:<DB_PASSWORD>@dpg-d847ihrbc2fs73c41ue0-a:5432/boysdb_8dms` |
| `JWT_SECRET` | `replace-with-a-random-32-plus-character-secret` |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.onrender.com` |

Use the **internal hostname** (`dpg-d847ihrbc2fs73c41ue0-a`) when the backend is also running on Render. Keep the real database password only in Render's environment-variable UI; do not commit it to this repository.

If you need to connect from outside Render, use the external hostname and require SSL:

```text
postgresql://boysdb_user:<DB_PASSWORD>@dpg-d847ihrbc2fs73c41ue0-a.oregon-postgres.render.com:5432/boysdb_8dms?sslmode=require
```
