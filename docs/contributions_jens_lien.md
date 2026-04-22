# Jens Lien Contributions

## Contribution Log
### 2026-04-18
- Added `CONTRIBUTING.md` with a simple team workflow for branch naming, commit preparation, PR expectations, and infrastructure changes.
- Added `docs/contributions_jens_lien.md` to maintain a personal record of work done in the repository.
- Added an initial GCP infrastructure scaffold under `infra/terraform/gcp`.
- Documented the gap between the current repository and a real GCP deploy path.
- Recommended Cloud Run over a long-lived VM for this repository's runtime shape.
- Added production-oriented Cloud Run Dockerfiles for backend and frontend.
- Updated backend CORS to support deployed frontend origins through configuration.
- Added a GitHub environment bootstrap script and example files with an explicit split between environment vars and secrets.
- Added a GitHub Actions workflow for Artifact Registry build/push and Cloud Run deploy.
- Documented first dev deploy steps and the Google Cloud / DNS setup for `hjertefrisk-dev.naerverk.no`, `hjertefrisk-stage.naerverk.no`, and `hjertefrisk.naerverk.no`.
- Added a bootstrap dry-run mode and filled local environment files from the supplied Supabase environment values.
- Added a non-production Cloud Run destroy workflow and an Artifact Registry cleanup policy with apply script.
- Added a GCP bootstrap script for APIs, Artifact Registry, service account, and GitHub OIDC setup.
