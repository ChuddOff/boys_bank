# Deploy backend to Render with Docker

This repository contains a Spring Boot backend in `backend/`. The root `Dockerfile` builds and runs that backend as a Docker web service on Render.

## Render service settings

Create a **Web Service** on Render and select **Docker** as the runtime. Render detects the `Dockerfile` at the repository root.

Recommended settings:

- **Root Directory**: leave empty
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
| `DB_URL` | `jdbc:postgresql://HOST:5432/DB_NAME?sslmode=require` | Use a JDBC PostgreSQL URL. If Render shows `postgresql://...`, convert it to `jdbc:postgresql://...`. |
| `DB_USERNAME` | `bank_user` | PostgreSQL username from Render. |
| `DB_PASSWORD` | `secret` | PostgreSQL password from Render. |
| `DB_DRIVER` | `org.postgresql.Driver` | Required when using PostgreSQL. |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.onrender.com` | Comma-separated list of frontend origins allowed to call the API. Add localhost only for local/dev use. |
| `FRAUD_API_URL` | `https://your-fraud-service.onrender.com/api/v1/check` | Optional. If omitted, the backend falls back to local fraud heuristics when the ML service is unavailable. |
| `JAVA_OPTS` | `-XX:MaxRAMPercentage=75` | Optional JVM tuning. |

For a quick first deploy without PostgreSQL, you can omit the `DB_*` variables and the app will use the default in-memory H2 database. Data will not persist between restarts.
