# GitHub Environment Bootstrap

This document explains how to bootstrap GitHub environments for Cloud Run deploys.

## Vars vs Secrets
Use **GitHub environment vars** for values that are not confidential and are safe to display to repository maintainers.

Examples:
- GCP project ID
- Cloud Run service names
- Artifact Registry repository name
- public backend URL
- public frontend URL
- Supabase public URL
- Supabase publishable key
- Workload Identity Provider resource name
- service account email

Use **GitHub environment secrets** for values that grant access, authenticate systems, or should not be visible in repository settings exports.

Examples:
- database connection string
- private tokens
- secret keys
- credentials that permit direct data access

## Important Note About Supabase Keys
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is not a secret in the normal sense. It belongs in `vars`.
- `Supabase__AnonKey` is also typically a public client key, but if the team prefers a stricter boundary it can stay in `secrets`.
- `SUPABASE_DB_URL` and `ConnectionStrings__Default` must stay in `secrets`.

## Files
- Bootstrap script: `scripts/bootstrap_github_cloud_run_env.sh`
- Example non-secret values: `ops/github/environments/*.vars.example`
- Example secret values: `ops/github/environments/*.secrets.example`

Real `*.secrets` files are gitignored. If a real `*.secrets` file is missing, the bootstrap script creates placeholder GitHub secrets from `*.secrets.example`.

## Usage
1. Copy the example files you need:

```bash
cp ops/github/environments/dev.vars.example ops/github/environments/dev.vars
cp ops/github/environments/dev.secrets.example ops/github/environments/dev.secrets
```

2. Replace placeholder values in `*.vars`.
3. Authenticate with GitHub CLI:

```bash
gh auth login
```

4. Run the bootstrap script:

```bash
scripts/bootstrap_github_cloud_run_env.sh dev
```

To verify what would be created without writing to GitHub:

```bash
scripts/bootstrap_github_cloud_run_env.sh dev --dry-run
```

The script will:
- create the GitHub environment if it does not exist
- set environment vars from `ops/github/environments/<env>.vars`
- set environment secrets from `ops/github/environments/<env>.secrets`
- if the real secrets file is missing, create placeholder GitHub secrets from `ops/github/environments/<env>.secrets.example`

## Current Recommended Split For This Repository
### Vars
- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GCP_ARTIFACT_REGION`
- `GCP_ARTIFACT_REPOSITORY`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT_EMAIL`
- `GCP_BACKEND_SERVICE`
- `GCP_FRONTEND_SERVICE`
- `GCP_BACKEND_IMAGE`
- `GCP_FRONTEND_IMAGE`
- `GCP_BACKEND_MEMORY`
- `GCP_FRONTEND_MEMORY`
- `GCP_BACKEND_CPU`
- `GCP_FRONTEND_CPU`
- `FRONTEND_ORIGINS`
- `NEXT_PUBLIC_API_URL`
- `API_URL_INTERNAL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Secrets
- `SUPABASE_DB_URL`
- `ConnectionStrings__Default`
- `Supabase__AnonKey`

## Recommended Team Workflow
- Commit `*.vars.example` and `*.secrets.example`.
- Keep real `*.secrets` out of git.
- Optionally commit real `*.vars` if the team wants environment config visible in version control.
- Let the bootstrap script create placeholder GitHub secrets first, then replace them manually in GitHub or by re-running the bootstrap script with a real `*.secrets` file later.
