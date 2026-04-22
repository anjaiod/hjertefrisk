# Documentation Review Checklist

Before closing a task that changed behavior, deployment, or operations, check:

- Does `docs/README.md` still point to the right operational docs?
- Does the relevant Cloud Run, GCP, or GitHub environment doc need an update?
- Did any environment variables or secrets change?
- Did any deploy, rollback, migration, or smoke-test command change?
- Does the final handover list what was verified?
