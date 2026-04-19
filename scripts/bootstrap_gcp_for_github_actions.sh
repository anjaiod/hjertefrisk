#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/bootstrap_gcp_for_github_actions.sh \
    --project-id <project-id> \
    [--region europe-west1] \
    [--artifact-repo hjertefrisk] \
    [--service-account github-actions] \
    [--pool github] \
    [--provider naerverk-hjertefrisk] \
    [--github-owner Naerverk] \
    [--github-repo hjertefrisk] \
    [--dry-run]

Creates or verifies:
  - required Google Cloud APIs
  - Artifact Registry repository
  - GitHub Actions service account
  - Workload Identity Pool
  - GitHub OIDC provider
  - IAM bindings for GitHub Actions OIDC

Outputs the values needed for:
  - GCP_PROJECT_ID
  - GCP_SERVICE_ACCOUNT_EMAIL
  - GCP_WORKLOAD_IDENTITY_PROVIDER
EOF
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

run_cmd() {
  local dry_run="$1"
  shift

  if [[ "$dry_run" == "1" ]]; then
    printf 'DRY RUN:'
    printf ' %q' "$@"
    printf '\n'
    return 0
  fi

  "$@"
}

resource_exists() {
  "$@" >/dev/null 2>&1
}

main() {
  require_command gcloud

  local project_id=""
  local region="europe-west1"
  local artifact_repo="hjertefrisk"
  local service_account_name="github-actions"
  local pool_id="github"
  local provider_id="naerverk-hjertefrisk"
  local github_owner="Naerverk"
  local github_repo="hjertefrisk"
  local dry_run=0

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --project-id)
        project_id="${2:-}"
        shift 2
        ;;
      --region)
        region="${2:-}"
        shift 2
        ;;
      --artifact-repo)
        artifact_repo="${2:-}"
        shift 2
        ;;
      --service-account)
        service_account_name="${2:-}"
        shift 2
        ;;
      --pool)
        pool_id="${2:-}"
        shift 2
        ;;
      --provider)
        provider_id="${2:-}"
        shift 2
        ;;
      --github-owner)
        github_owner="${2:-}"
        shift 2
        ;;
      --github-repo)
        github_repo="${2:-}"
        shift 2
        ;;
      --dry-run)
        dry_run=1
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        echo "Unknown argument: $1" >&2
        usage
        exit 1
        ;;
    esac
  done

  if [[ -z "$project_id" ]]; then
    echo "Missing required argument: --project-id" >&2
    usage
    exit 1
  fi

  local project_number
  if [[ "$dry_run" == "1" ]]; then
    project_number="<project-number>"
  else
    gcloud config set project "$project_id" >/dev/null
    project_number="$(gcloud projects describe "$project_id" --format='value(projectNumber)')"
  fi

  local service_account_email="${service_account_name}@${project_id}.iam.gserviceaccount.com"
  local provider_resource="projects/${project_number}/locations/global/workloadIdentityPools/${pool_id}/providers/${provider_id}"
  local principal="principalSet://iam.googleapis.com/projects/${project_number}/locations/global/workloadIdentityPools/${pool_id}/attribute.repository/${github_owner}/${github_repo}"
  local attribute_condition="assertion.repository=='${github_owner}/${github_repo}'"

  echo "Project ID: ${project_id}"
  echo "Project Number: ${project_number}"
  echo "Region: ${region}"
  echo "Artifact Registry repo: ${artifact_repo}"
  echo "Service account email: ${service_account_email}"
  echo "Workload identity provider: ${provider_resource}"
  if [[ "$dry_run" == "1" ]]; then
    echo "Mode: dry-run"
  fi

  local apis=(
    run.googleapis.com
    artifactregistry.googleapis.com
    iam.googleapis.com
    iamcredentials.googleapis.com
    sts.googleapis.com
    serviceusage.googleapis.com
    cloudresourcemanager.googleapis.com
    compute.googleapis.com
  )

  run_cmd "$dry_run" gcloud services enable "${apis[@]}" --project "$project_id"

  if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud artifacts repositories describe "$artifact_repo" --location "$region" --project "$project_id"; then
    run_cmd "$dry_run" gcloud artifacts repositories create "$artifact_repo" \
      --repository-format=docker \
      --location="$region" \
      --description="Hjertefrisk container images" \
      --project "$project_id"
  else
    echo "Artifact Registry repository already exists: ${artifact_repo}"
  fi

  if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud iam service-accounts describe "$service_account_email" --project "$project_id"; then
    run_cmd "$dry_run" gcloud iam service-accounts create "$service_account_name" \
      --display-name="GitHub Actions" \
      --project "$project_id"
  else
    echo "Service account already exists: ${service_account_email}"
  fi

  if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud iam workload-identity-pools describe "$pool_id" --location=global --project "$project_id"; then
    run_cmd "$dry_run" gcloud iam workload-identity-pools create "$pool_id" \
      --location=global \
      --display-name="GitHub Actions" \
      --project "$project_id"
  else
    echo "Workload identity pool already exists: ${pool_id}"
  fi

  if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud iam workload-identity-pools providers describe "$provider_id" --location=global --workload-identity-pool="$pool_id" --project "$project_id"; then
    run_cmd "$dry_run" gcloud iam workload-identity-pools providers create-oidc "$provider_id" \
      --location=global \
      --workload-identity-pool="$pool_id" \
      --display-name="GitHub ${github_owner}/${github_repo}" \
      --issuer-uri="https://token.actions.githubusercontent.com" \
      --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
      --attribute-condition="$attribute_condition" \
      --project "$project_id"
  else
    echo "Workload identity provider already exists: ${provider_id}"
  fi

  local roles=(
    roles/run.admin
    roles/artifactregistry.writer
    roles/iam.serviceAccountUser
  )

  for role in "${roles[@]}"; do
    run_cmd "$dry_run" gcloud projects add-iam-policy-binding "$project_id" \
      --member="serviceAccount:${service_account_email}" \
      --role="$role"
  done

  run_cmd "$dry_run" gcloud iam service-accounts add-iam-policy-binding "$service_account_email" \
    --project "$project_id" \
    --role="roles/iam.workloadIdentityUser" \
    --member="$principal"

  echo
  echo "Values to copy into your environment vars:"
  echo "GCP_PROJECT_ID=${project_id}"
  echo "GCP_SERVICE_ACCOUNT_EMAIL=${service_account_email}"
  echo "GCP_WORKLOAD_IDENTITY_PROVIDER=${provider_resource}"
}

main "$@"
