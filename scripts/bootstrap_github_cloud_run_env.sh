#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/bootstrap_github_cloud_run_env.sh <environment> [--repo owner/repo] [--dry-run]

Default file inputs:
  ops/github/environments/<environment>.vars
  ops/github/environments/<environment>.secrets

Example:
  scripts/bootstrap_github_cloud_run_env.sh dev
  scripts/bootstrap_github_cloud_run_env.sh staging --repo Naerverk/hjertefrisk
  scripts/bootstrap_github_cloud_run_env.sh prod --dry-run

Behavior:
  - vars are read from <environment>.vars
  - secrets are read from <environment>.secrets when present
  - if <environment>.secrets is missing, placeholder values are created from
    <environment>.secrets.example
EOF
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

log_set_action() {
  local kind="$1"
  local key="$2"
  local source_label="$3"
  local dry_run="$4"
  local note="${5:-}"

  if [[ "$dry_run" == "1" ]]; then
    echo "Would set ${kind%?}: ${key} (${source_label})${note:+ ${note}}"
  else
    echo "Set ${kind%?}: ${key} (${source_label})${note:+ ${note}}"
  fi
}

infer_repo_from_git() {
  local remote_url repo
  remote_url="$(git remote get-url origin)"

  case "$remote_url" in
    git@github.com:*)
      repo="${remote_url#git@github.com:}"
      repo="${repo%.git}"
      ;;
    https://github.com/*)
      repo="${remote_url#https://github.com/}"
      repo="${repo%.git}"
      ;;
    *)
      echo "Could not infer GitHub repo from origin remote: $remote_url" >&2
      exit 1
      ;;
  esac

  printf '%s\n' "$repo"
}

upsert_environment() {
  local repo="$1"
  local environment="$2"

  gh api \
    --method PUT \
    -H "Accept: application/vnd.github+json" \
    "repos/${repo}/environments/${environment}" >/dev/null
}

apply_key_value_file() {
  local kind="$1"
  local repo="$2"
  local environment="$3"
  local file_path="$4"
  local source_label="${5:-$file_path}"
  local dry_run="${6:-0}"

  if [[ ! -f "$file_path" ]]; then
    echo "Skipping missing ${kind} file: ${file_path}"
    return 0
  fi

  while IFS= read -r raw_line || [[ -n "$raw_line" ]]; do
    local line key value note
    line="${raw_line#"${raw_line%%[![:space:]]*}"}"

    if [[ -z "$line" || "${line:0:1}" == "#" ]]; then
      continue
    fi

    if [[ "$line" != *"="* ]]; then
      echo "Invalid line in ${file_path}: ${raw_line}" >&2
      exit 1
    fi

    key="${line%%=*}"
    value="${line#*=}"

    if [[ -z "$key" ]]; then
      echo "Invalid empty key in ${file_path}: ${raw_line}" >&2
      exit 1
    fi

    note=""
    if [[ "$kind" == "secrets" ]]; then
      if [[ -z "$value" || "$value" == "-" || ( "$value" == \<* && "$value" == *\> ) ]]; then
        note="[placeholder value: update in GitHub after bootstrap]"
      fi
    fi

    if [[ "$dry_run" != "1" ]]; then
      if [[ "$kind" == "vars" ]]; then
        gh variable set "$key" --env "$environment" --repo "$repo" --body "$value" >/dev/null
      else
        printf '%s' "$value" | gh secret set "$key" --env "$environment" --repo "$repo" --body - >/dev/null
      fi
    fi

    log_set_action "$kind" "$key" "$source_label" "$dry_run" "$note"
  done <"$file_path"
}

main() {
  require_command gh
  require_command git

  if [[ $# -lt 1 ]]; then
    usage
    exit 1
  fi

  local environment="$1"
  shift

  local repo=""
  local dry_run=0
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --repo)
        repo="${2:-}"
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

  if [[ -z "$repo" ]]; then
    repo="$(infer_repo_from_git)"
  fi

  local vars_file="ops/github/environments/${environment}.vars"
  local secrets_file="ops/github/environments/${environment}.secrets"
  local secrets_example_file="ops/github/environments/${environment}.secrets.example"

  echo "Repository: ${repo}"
  echo "Environment: ${environment}"
  echo "Vars file: ${vars_file}"
  echo "Secrets file: ${secrets_file}"
  if [[ "$dry_run" == "1" ]]; then
    echo "Mode: dry-run"
  fi

  if [[ "$dry_run" != "1" ]]; then
    gh auth status >/dev/null
  fi

  if [[ "$dry_run" == "1" ]]; then
    echo "Would ensure GitHub environment exists: ${environment}"
  else
    upsert_environment "$repo" "$environment"
    echo "Ensured GitHub environment exists: ${environment}"
  fi

  apply_key_value_file "vars" "$repo" "$environment" "$vars_file" "$vars_file" "$dry_run"

  if [[ -f "$secrets_file" ]]; then
    apply_key_value_file "secrets" "$repo" "$environment" "$secrets_file" "real secrets file" "$dry_run"
  elif [[ -f "$secrets_example_file" ]]; then
    echo "Real secrets file not found. Creating placeholder GitHub secrets from ${secrets_example_file}."
    apply_key_value_file "secrets" "$repo" "$environment" "$secrets_example_file" "placeholder secrets example" "$dry_run"
  else
    echo "No secrets file or secrets example found for ${environment}." >&2
  fi

  echo "Bootstrap complete."
}

main "$@"
