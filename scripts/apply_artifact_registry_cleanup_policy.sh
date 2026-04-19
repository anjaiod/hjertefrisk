#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/apply_artifact_registry_cleanup_policy.sh <project-id> <location> <repository> [--dry-run]

Example:
  scripts/apply_artifact_registry_cleanup_policy.sh my-project europe-west1 hjertefrisk --dry-run
EOF
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

main() {
  require_command gcloud

  if [[ $# -lt 3 ]]; then
    usage
    exit 1
  fi

  local project_id="$1"
  local location="$2"
  local repository="$3"
  shift 3

  local dry_run=0
  while [[ $# -gt 0 ]]; do
    case "$1" in
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

  local policy_file="ops/gcp/artifact_registry_cleanup_policy.json"

  if [[ ! -f "$policy_file" ]]; then
    echo "Cleanup policy file not found: ${policy_file}" >&2
    exit 1
  fi

  local cmd=(
    gcloud artifacts repositories set-cleanup-policies
    "$repository"
    "--project=${project_id}"
    "--location=${location}"
    "--policy=${policy_file}"
  )

  if [[ "$dry_run" == "1" ]]; then
    cmd+=("--dry-run")
    echo "Running in dry-run mode."
  fi

  "${cmd[@]}"

  echo "Cleanup policy applied command completed for ${repository}."
}

main "$@"
