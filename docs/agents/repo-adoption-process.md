# Repository Adoption Process

Use this process when adopting selected material from `ai-infra-template`.

## Order

1. Inspect this repository first.
2. Identify existing equivalents for docs, workflows, scripts, and infrastructure.
3. Copy only template files that improve the existing setup.
4. Adapt copied content to Hjertefrisk, Cloud Run, and the existing `docs/` layout.
5. Prefer merging with existing files over replacing them.
6. Document which template files were used and which were intentionally skipped.
7. Run relevant validation for changed code, workflows, or Terraform.

## Local Rules

- Use `docs/`, not `doc/`, because this repository already uses `docs/`.
- Keep the existing GCP and Cloud Run deployment model.
- Do not introduce Azure Terraform unless explicitly requested.
- Do not replace existing GitHub Actions workflows with template workflows unless there is a concrete gap.
