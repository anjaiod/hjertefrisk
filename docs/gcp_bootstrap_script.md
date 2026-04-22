# GCP Bootstrap Script

This script bootstraps the Google Cloud pieces needed by GitHub Actions:

- enable required APIs
- create Artifact Registry
- create a GitHub Actions service account
- create Workload Identity Pool and OIDC provider
- grant the required IAM bindings

Script:
- `scripts/bootstrap_gcp_for_github_actions.sh`

## Automates
- `run.googleapis.com`
- `artifactregistry.googleapis.com`
- `iam.googleapis.com`
- `iamcredentials.googleapis.com`
- `sts.googleapis.com`
- `serviceusage.googleapis.com`
- `cloudresourcemanager.googleapis.com`
- `compute.googleapis.com`
- Artifact Registry repository creation
- GitHub Actions service account creation
- Workload Identity Pool creation
- GitHub OIDC provider creation
- IAM bindings for GitHub OIDC impersonation

## Does Not Automate
- creating the Google Cloud project
- enabling billing
- load balancer setup
- DNS records
- SSL certificate wiring

Those are kept manual because they depend more on billing setup, domain routing, and review of public infrastructure.

## Dry Run
Run this first:

```bash
scripts/bootstrap_gcp_for_github_actions.sh \
  --project-id <project-id> \
  --dry-run
```

## Typical Real Run

```bash
scripts/bootstrap_gcp_for_github_actions.sh \
  --project-id <project-id> \
  --region europe-west1 \
  --artifact-repo hjertefrisk \
  --service-account github-actions \
  --pool github \
  --provider naerverk-hjertefrisk \
  --github-owner Naerverk \
  --github-repo hjertefrisk
```

## Output
At the end, the script prints:
- `GCP_PROJECT_ID`
- `GCP_SERVICE_ACCOUNT_EMAIL`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`

These are the missing values that should be copied into:
- `ops/github/environments/dev.vars`
- `ops/github/environments/staging.vars`
- `ops/github/environments/prod.vars`

## Notes
- The provider resource format matches what `google-github-actions/auth` expects.
- The script restricts the OIDC provider to the `Naerverk/hjertefrisk` repository by default.
- If you want organization-wide reuse, relax that condition deliberately instead of broadening it by accident.

References:
- Google guide for Workload Identity Federation with deployment pipelines: https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines
- `google-github-actions/auth`: https://github.com/google-github-actions/auth
