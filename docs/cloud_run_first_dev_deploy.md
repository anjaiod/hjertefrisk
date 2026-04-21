# First Dev Deploy To Cloud Run

This is the shortest path to the first `dev` deployment.

## Goal
Deploy:
- `hjertefrisk-backend-dev`
- `hjertefrisk-frontend-dev`

Then prepare the custom domain `hjertefrisk-dev.naerverk.no` through a Google Cloud load balancer.

## Prerequisites
- A Google Cloud project with billing enabled
- Owner or equivalent IAM access in the Google Cloud project
- Admin access to the GitHub repository
- DNS access for `naerverk.no`
- `gh` authenticated locally

## 1. Prepare Local Environment Files

```bash
cp ops/github/environments/dev.vars.example ops/github/environments/dev.vars
```

Replace placeholders in `dev.vars`.

For secrets you have two valid options:
- create `ops/github/environments/dev.secrets` with real values before bootstrap
- skip the real secrets file for now and let the bootstrap script create placeholder GitHub secrets from `dev.secrets.example`

Minimum values to verify in `dev.vars`:
- `GCP_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT_EMAIL`
- `GCP_ARTIFACT_REPOSITORY`
- `GCP_BACKEND_SERVICE`
- `GCP_FRONTEND_SERVICE`
- `RUN_DB_MIGRATIONS=false`
- `FRONTEND_ORIGINS=https://hjertefrisk-dev.naerverk.no`
- `NEXT_PUBLIC_API_URL=https://hjertefrisk-dev.naerverk.no`
- `API_URL_INTERNAL=https://hjertefrisk-dev.naerverk.no`

If you use a real `dev.secrets`, it must contain:
- `SUPABASE_DB_URL`
- `ConnectionStrings__Default`
- `Supabase__AnonKey`

`Supabase__AnonKey` is the Supabase anon key for the environment. It is the same value frontend previously used as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 2. Bootstrap GitHub Environment

```bash
scripts/bootstrap_github_cloud_run_env.sh dev
```

Use `--dry-run` first if you want to verify what will be written.

## 3. Prepare Google Cloud
Complete the Google-side setup described in:

- `docs/gcp_naerverk_domain_setup.md`
- `docs/gcp_bootstrap_script.md`

At minimum:
- enable required APIs
- create Artifact Registry repository
- create GitHub Actions service account
- configure Workload Identity Federation for GitHub
- grant the service account required IAM roles

## 4. Run The Deploy Workflow
In GitHub:

1. Open `Actions`
2. Open `Cloud Run Deploy`
3. Choose:
   - `target_environment=dev`
   - `git_ref=infra/gcp-terraform-deploy` or the branch/ref you want to test
4. Run workflow

For a normal deploy, keep the selected environment variable `RUN_DB_MIGRATIONS=false`.

If the database schema must be updated during this deploy:

1. Open GitHub `Settings`
2. Open `Environments`
3. Select the target environment, for example `staging`
4. Set environment variable `RUN_DB_MIGRATIONS=true`
5. Run `Cloud Run Deploy`
6. Verify the backend starts and `/health/db` succeeds
7. Set `RUN_DB_MIGRATIONS=false` again before the next normal deploy

For staging tag deploys, push the `stage-*` tag only after setting the `staging` environment variable to the intended value. The tag-triggered workflow does not ask for inputs; it automatically uses the `staging` GitHub Environment.

## 5. Verify
Check:
- frontend service URL loads
- backend service URL `/health/db` returns success

## 6. Add The Custom Domain
After the services exist, continue with:

- `docs/gcp_naerverk_domain_setup.md`

The recommended target is:
- one external Application Load Balancer
- host rules for `hjertefrisk-dev.naerverk.no`, `hjertefrisk-stage.naerverk.no`, and `hjertefrisk.naerverk.no`
- path routing so `/api/*`, `/health/*`, and `/swagger/*` go to backend, while all other paths go to frontend

## 7. Repeat For Other Environments
Repeat the same pattern for:
- `staging`
- `prod`

Use:

```bash
cp ops/github/environments/staging.vars.example ops/github/environments/staging.vars
scripts/bootstrap_github_cloud_run_env.sh staging
```

And later:

```bash
cp ops/github/environments/prod.vars.example ops/github/environments/prod.vars
scripts/bootstrap_github_cloud_run_env.sh prod
```
