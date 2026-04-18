# Contributing

## Purpose
This file describes the default contribution workflow for this repository so the team uses the same conventions.

## Branch Names
Use descriptive branch names with a type prefix:

- `feat/<description>` for new features
- `fix/<description>` for bug fixes
- `infra/<description>` for infrastructure and deployment
- `ci/<description>` for CI/CD changes
- `docs/<description>` for documentation
- `refactor/<description>` for internal code improvements
- `test/<description>` for tests
- `chore/<description>` for maintenance work

Examples:

- `feat/patient-dashboard`
- `fix/login-validation`
- `infra/gcp-terraform-deploy`
- `ci/frontend-build-check`

Rules:

- use lowercase letters
- use hyphens between words
- keep names short but descriptive
- prefer a description over only an issue number
- add an issue number in the PR, not necessarily in the branch name

## Before You Commit
If you changed the frontend:

```bash
cd frontend
npm run lint
npx prettier . --check
```

If you changed the backend:

```bash
cd backend
dotnet format
dotnet build
```

If you changed infrastructure:

```bash
cd infra/terraform/<provider>
terraform fmt -recursive
terraform validate
```

## Pull Requests
- Keep each PR focused on one change area.
- Use a clear title that explains the user-facing or technical change.
- Link the related issue or task when relevant.
- Describe any manual setup, secrets, environment variables, or migration steps.
- Request review before merging into `main`.

## Infrastructure Changes
For Terraform, cloud, or deployment changes:

- document assumptions and environment scope
- keep secrets and environment-specific values out of committed source files
- record major deployment decisions in documentation or an ADR
- include validation steps in the PR description

## Communication
If a change affects the rest of the team, add a short summary to the PR description explaining:

- what changed
- why it changed
- what others need to pull, configure, or test
