# Cloud Run Deploy Plan

This document is the high-level deployment overview for `hjertefrisk` on Google Cloud Run.

## Recommended Service Layout
- `hjertefrisk-backend`: ASP.NET Core API on Cloud Run
- `hjertefrisk-frontend`: Next.js frontend on Cloud Run

Deploy them as separate services so frontend and backend can scale and roll out independently.

## Production Container Files
- Backend production image: `backend/Dockerfile.cloudrun`
- Frontend production image: `frontend/Dockerfile.cloudrun`

These are separate from the current development Dockerfiles so local Docker Compose stays unchanged.

## Runtime Configuration
### Backend
- `ConnectionStrings__Default`
- `Supabase__Url`
- `Supabase__AnonKey`
- `FRONTEND_ORIGINS`
- optional: `RUN_DB_MIGRATIONS=true` if you deliberately want schema migrations during startup

### Frontend build-time values
- `NEXT_PUBLIC_API_URL`
- `API_URL_INTERNAL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Important Note About Frontend Variables
`NEXT_PUBLIC_*` variables are embedded into the frontend build. That means the frontend image should be built per environment if the public API or Supabase values differ between `dev`, `staging`, and `prod`.

## Database Migrations
Automatic EF Core migrations are enabled by default in development only.

For Cloud Run, the backend now starts without running migrations unless `RUN_DB_MIGRATIONS=true` is set explicitly. This avoids Cloud Run startup failures when database connectivity or schema changes are not ready yet.

## Registry
Use Google Artifact Registry as the container registry for Cloud Run deploys.

## Workflow
Use `.github/workflows/cloud-run-deploy.yml` to:
- authenticate to GCP with GitHub OIDC
- build backend and frontend images
- push images to Artifact Registry
- deploy both services to Cloud Run
- run smoke tests against the deployed URLs

## Custom Domains
Use a global external Application Load Balancer in front of Cloud Run for:
- `hjertefrisk-dev.naerverk.no`
- `hjertefrisk-stage.naerverk.no`
- `hjertefrisk.naerverk.no`

Recommended routing:
- `/api/*`, `/health/*`, and `/swagger/*` to backend
- all other paths to frontend

See:
- `docs/cloud_run_first_dev_deploy.md`
- `docs/gcp_naerverk_domain_setup.md`
- `docs/cloud_run_destroy_and_cleanup.md`
