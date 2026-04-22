# AI Infra Template Adoption

Source template inspected: `../../it2901-26/ai-infra-template`.

The requested path `../../ai-infra-template` was not present from this repository root. The available template was found one directory deeper under `../../it2901-26/ai-infra-template`.

## Template Files Used

- `AGENTS.md`: adapted into root `AGENTS.md` with Hjertefrisk-specific structure, commands, and Cloud Run guidance.
- `doc/agents/README.md`: adapted into `docs/agents/README.md`.
- `doc/agents/repo-adoption-process.md`: adapted into `docs/agents/repo-adoption-process.md`.
- `doc/agents/deployment-process.md`: adapted into `docs/agents/deployment-process.md`.
- `doc/agents/doc-review-checklist.md`: adapted into `docs/agents/doc-review-checklist.md`.
- `doc/adoption-guide.md`: used as process guidance for selective adoption.

## Template Files Intentionally Skipped

- `infra/terraform/azure/**`: skipped because this repository deploys to GCP Cloud Run.
- `infra/terraform/gcp/**`: skipped because this repository already has a GCP Terraform scaffold and Cloud Run setup.
- `.github/**`: skipped because this repository already has project-specific CI/CD and Cloud Run workflows.
- `BOOTSTRAP.md`: skipped because the existing `README.md`, `docs/README.md`, and deployment docs already cover setup and operations.
- Template `doc/context.md`, `doc/architecture.md`, `doc/features.md`, `doc/TODO.md`, and iteration docs: skipped to avoid creating parallel documentation that does not yet reflect the Hjertefrisk domain.

## Notes

The adoption keeps the repository's existing `docs/` directory name instead of introducing the template's `doc/` directory.
