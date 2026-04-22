# Release And Deploy Tags

This repository does not currently use Git tags as part of the deploy mechanism.

## What Happens Today
- Staging deploys can be started automatically by pushing a Git tag that matches `stage-*`.
- Deploys can also be started manually from GitHub Actions.
- The manual workflow takes:
  - a target environment: `dev`, `staging`, or `prod`
  - a `git_ref` to deploy
- Docker images are tagged automatically inside the workflow as:
  - `<environment>-<short_sha>`

Examples:
- `dev-1a2b3c4`
- `staging-5d6e7f8`
- `prod-9a0b1c2`

This means the effective deploy tag today is the image tag produced from:
- the selected environment
- the commit SHA that was deployed

## Automatic Tag Trigger
The repository now supports automatic staging deploys from Git tags:

- push a tag matching `stage-*`
- the `Cloud Run Deploy` workflow starts automatically
- the workflow deploys to the `staging` GitHub environment
- the tag name itself is used as `git_ref`

Example:
- `stage-2026-04-20-01`

At the moment:
- `stage-*` tags trigger staging deploy automatically
- `dev` and `prod` deploys are still manual

## Current Recommended Process
1. Merge or push the code you want to deploy.
2. Run `Cloud Run Deploy` in GitHub Actions.
3. Choose:
   - `target_environment`
   - `git_ref`
4. Let the workflow build and push images tagged as `<environment>-<short_sha>`.
5. Use the workflow summary and image tags as the deploy record.

## Recommended Git Tag Convention
If you want a simple and readable deploy marker, use Git tags in this format:

- `<environment>-YYYY-MM-DD-XX`

Examples:
- `dev-2026-04-20-01`
- `stage-2026-04-20-01`
- `stage-2026-04-20-02`
- `prod-2026-04-20-01`

Where:
- `<environment>` is `dev`, `stage`, or `prod`
- `YYYY-MM-DD` is the deployment date
- `XX` is a two-digit sequence number for that environment on that date

Recommended use:
- create a Git tag when you want a readable release/deploy marker
- for staging, push the tag and let the workflow trigger automatically
- for manual deploys, use GitHub Actions with `git_ref=<tag-name>`
- treat the workflow's image tag as the technical deploy identifier

Short example:
1. Create tag `stage-2026-04-20-01`
2. Push the tag
3. `Cloud Run Deploy` starts automatically for `staging`

Manual example:
1. Create tag `prod-2026-04-20-01`
2. Push the tag
3. Run `Cloud Run Deploy`
4. Set `target_environment=prod`
5. Set `git_ref=prod-2026-04-20-01`

## Short Rule
- `stage-*` tags trigger staging deploy automatically
- GitHub Actions can also deploy manually from a branch, commit, or tag given in `git_ref`
- the workflow creates image tags automatically as `<environment>-<short_sha>`
- use Git tags like `stage-2026-04-20-01` when you want a readable deploy marker
