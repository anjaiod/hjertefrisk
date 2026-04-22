# Cloud Run Destroy And Artifact Cleanup

This document describes how to stop spending on non-production environments and how to prevent Artifact Registry from growing indefinitely.

## Recommended Practice

### For day-to-day use
- keep Cloud Run services deployed
- use `min instances = 0`
- let Cloud Run scale down automatically

This is usually enough for normal dev and staging use.

### When you want to cut more cost
Use a manual destroy flow for `dev` and `staging`:
- delete the Cloud Run services
- optionally keep the custom domain and load balancer work for later

### For image storage
Use an Artifact Registry cleanup policy so old images are automatically deleted.

## Destroy Workflow
Use `.github/workflows/cloud-run-destroy.yml`.

This workflow:
- supports `dev`
- supports `staging`
- deletes the backend and frontend Cloud Run services for the selected environment

It does **not** delete:
- load balancer
- DNS records
- SSL certificate
- static IP
- Artifact Registry repository

That is intentional. Those resources are slower-moving infrastructure and should be removed explicitly, not as part of a casual stop action.

## How To Use The Destroy Workflow
In GitHub:

1. Open `Actions`
2. Open `Cloud Run Destroy Nonprod`
3. Pick `dev` or `staging`
4. Run the workflow

The workflow is intentionally limited to non-production environments.

## Artifact Registry Cleanup Policy
Policy file: `ops/gcp/artifact_registry_cleanup_policy.json`

Current policy:
- keep the 10 most recent versions
- delete images older than 30 days

If an image matches both keep and delete policy, Artifact Registry applies the keep policy. Source:
- https://cloud.google.com/artifact-registry/docs/repositories/cleanup-policy-overview

## Apply Cleanup Policy
Script: `scripts/apply_artifact_registry_cleanup_policy.sh`

Dry run:

```bash
scripts/apply_artifact_registry_cleanup_policy.sh <project-id> europe-west1 hjertefrisk --dry-run
```

Apply for real:

```bash
scripts/apply_artifact_registry_cleanup_policy.sh <project-id> europe-west1 hjertefrisk
```

List policies afterwards:

```bash
gcloud artifacts repositories list-cleanup-policies hjertefrisk \
  --project=<project-id> \
  --location=europe-west1
```

References:
- `gcloud artifacts repositories set-cleanup-policies`: https://cloud.google.com/sdk/gcloud/reference/artifacts/repositories/set-cleanup-policies
- Artifact Registry cleanup policy docs: https://cloud.google.com/artifact-registry/docs/repositories/cleanup-policy

## What To Do Manually
Destroying Cloud Run services is safe to automate. These are better done manually:
- deleting the load balancer
- releasing the global static IP
- removing DNS records
- removing managed SSL certificates

Those resources are coupled to domain routing and are easier to review manually before deletion.
