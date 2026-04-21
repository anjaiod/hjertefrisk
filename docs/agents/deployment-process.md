# Deployment Process

Use this process when changing deployment, infrastructure, runtime config, or cloud topology.

## Order

1. Read `docs/README.md` and the specific deployment doc for the area being changed.
2. Identify the affected environment: `dev`, `staging`, or `prod`.
3. Separate app-runtime changes from cloud-resource changes.
4. Keep secrets in GitHub environment secrets, not source files.
5. Keep non-secret environment values in GitHub environment vars or `ops/github/environments/*.vars.example`.
6. Update docs in the same task when behavior or operational steps change.
7. Run relevant build, workflow, or Terraform checks when possible.

## Cloud Run Diagnostics

Runtime exceptions from the backend should be logged with ASP.NET Core `ILogger`. In Google Cloud, inspect them in Cloud Logging for the relevant Cloud Run service, for example:

```bash
gcloud logging read \
  'resource.type="cloud_run_revision" AND resource.labels.service_name="hjertefrisk-backend-staging"' \
  --project "<gcp-project-id>" \
  --limit 100 \
  --order desc
```

Browser console logs only show frontend/client-side errors. Server-side `500` causes are in backend logs.
