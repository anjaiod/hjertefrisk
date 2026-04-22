# AGENTS.md

Guidelines for AI agents and contributors working in this repository.

Prefer existing repository patterns over introducing new ones. This project already has Cloud Run workflows, GCP scripts, Dockerfiles, and deployment docs under `docs/`, `infra/`, `ops/`, and `scripts/`; treat those as the source of truth.

## Start Here

Before making non-trivial changes, read the files relevant to the work:

- `README.md` for local development and verification commands.
- `backend/README.md` for backend-specific notes.
- `frontend/README.md` for frontend-specific notes.
- `docs/README.md` before changing deployment, operations, or release flow.
- `infra/README.md` and `infra/terraform/README.md` before changing infrastructure.
- `docs/agents/repo-adoption-process.md` when adopting template material.
- `docs/agents/deployment-process.md` when changing Cloud Run, GCP, GitHub Actions, Terraform, or runtime configuration.

## Code Rules

- Keep changes small and focused.
- Prefer the existing backend structure under `backend/src/Application`, `backend/src/Api`, `backend/src/Domain`, and `backend/src/Infrastructure`.
- Prefer the existing frontend component and service patterns under `frontend/src`.
- Keep API communication in dedicated frontend service/client modules.
- Do not hardcode secrets, connection strings, Supabase keys, GCP project IDs, or environment-specific values.
- Use structured application logging for production diagnostics; Cloud Run captures stdout/stderr and ASP.NET Core `ILogger` output.

## Deployment And Infrastructure

- The active cloud target is Google Cloud Run.
- Current environment setup lives in `.github/workflows/`, `ops/github/environments/`, `scripts/`, and `infra/terraform/gcp/`.
- Keep environment-specific values in GitHub environment vars/secrets or `env/*.tfvars.example` files.
- Avoid adding Azure or another cloud unless the project explicitly chooses it.
- Update deployment docs in `docs/` when changing workflows, runtime config, infrastructure topology, or operational commands.

## Verification

Run the relevant checks for the changed area before handing over:

- Backend: `dotnet build backend/api.csproj`
- Frontend: `npm run lint` from `frontend/`
- Terraform: `terraform fmt -recursive` and `terraform validate` in the affected Terraform directory when Terraform files changed

State exactly what was run and what could not be run.
