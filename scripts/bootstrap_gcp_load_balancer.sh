#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/bootstrap_gcp_load_balancer.sh \
    --project-id <project-id> \
    [--region europe-west1] \
    [--domain-dev hjertefrisk-dev.naerverk.no] \
    [--domain-stage hjertefrisk-stage.naerverk.no] \
    [--domain-prod hjertefrisk.naerverk.no] \
    [--dry-run]

Creates or verifies:
  - one global static IP for the load balancer
  - one Google-managed certificate for dev/stage/prod domains
  - one serverless NEG per Cloud Run service
  - one backend service per frontend/backend Cloud Run service
  - one URL map with host and path routing
  - one HTTPS target proxy
  - one global forwarding rule on port 443

Expected Cloud Run services:
  - hjertefrisk-frontend-dev
  - hjertefrisk-backend-dev
  - hjertefrisk-frontend-staging
  - hjertefrisk-backend-staging
  - hjertefrisk-frontend-prod
  - hjertefrisk-backend-prod
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

write_url_map_config() {
  local file_path="$1"
  local project_id="$2"
  local domain_dev="$3"
  local domain_stage="$4"
  local domain_prod="$5"

  cat >"$file_path" <<EOF
name: hjertefrisk-web-map
defaultService: https://www.googleapis.com/compute/v1/projects/${project_id}/global/backendServices/hjertefrisk-frontend-dev-bes
hostRules:
  - hosts:
      - ${domain_dev}
    pathMatcher: dev-matcher
  - hosts:
      - ${domain_stage}
    pathMatcher: stage-matcher
  - hosts:
      - ${domain_prod}
    pathMatcher: prod-matcher
pathMatchers:
  - name: dev-matcher
    defaultService: https://www.googleapis.com/compute/v1/projects/${project_id}/global/backendServices/hjertefrisk-frontend-dev-bes
    pathRules:
      - paths:
          - /api
          - /api/*
          - /health
          - /health/*
          - /swagger
          - /swagger/*
        service: https://www.googleapis.com/compute/v1/projects/${project_id}/global/backendServices/hjertefrisk-backend-dev-bes
  - name: stage-matcher
    defaultService: https://www.googleapis.com/compute/v1/projects/${project_id}/global/backendServices/hjertefrisk-frontend-staging-bes
    pathRules:
      - paths:
          - /api
          - /api/*
          - /health
          - /health/*
          - /swagger
          - /swagger/*
        service: https://www.googleapis.com/compute/v1/projects/${project_id}/global/backendServices/hjertefrisk-backend-staging-bes
  - name: prod-matcher
    defaultService: https://www.googleapis.com/compute/v1/projects/${project_id}/global/backendServices/hjertefrisk-frontend-prod-bes
    pathRules:
      - paths:
          - /api
          - /api/*
          - /health
          - /health/*
          - /swagger
          - /swagger/*
        service: https://www.googleapis.com/compute/v1/projects/${project_id}/global/backendServices/hjertefrisk-backend-prod-bes
EOF
}

create_or_update_url_map() {
  local dry_run="$1"
  local project_id="$2"
  local domain_dev="$3"
  local domain_stage="$4"
  local domain_prod="$5"
  local tmp_file

  tmp_file="$(mktemp)"
  write_url_map_config "$tmp_file" "$project_id" "$domain_dev" "$domain_stage" "$domain_prod"

  if [[ "$dry_run" == "1" ]]; then
    echo "Generated URL map config:"
    cat "$tmp_file"
    rm -f "$tmp_file"
    run_cmd "$dry_run" gcloud compute url-maps import hjertefrisk-web-map \
      --project "$project_id" \
      --global \
      --source "$tmp_file" \
      --quiet
    return 0
  fi

  gcloud compute url-maps import hjertefrisk-web-map \
    --project "$project_id" \
    --global \
    --source "$tmp_file" \
    --quiet

  rm -f "$tmp_file"
}

main() {
  require_command gcloud

  local project_id=""
  local region="europe-west1"
  local domain_dev="hjertefrisk-dev.naerverk.no"
  local domain_stage="hjertefrisk-stage.naerverk.no"
  local domain_prod="hjertefrisk.naerverk.no"
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
      --domain-dev)
        domain_dev="${2:-}"
        shift 2
        ;;
      --domain-stage)
        domain_stage="${2:-}"
        shift 2
        ;;
      --domain-prod)
        domain_prod="${2:-}"
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

  if [[ "$dry_run" != "1" ]]; then
    gcloud config set project "$project_id" >/dev/null
  fi

  echo "Project ID: ${project_id}"
  echo "Region: ${region}"
  echo "Domains:"
  echo "  dev: ${domain_dev}"
  echo "  stage: ${domain_stage}"
  echo "  prod: ${domain_prod}"
  if [[ "$dry_run" == "1" ]]; then
    echo "Mode: dry-run"
  fi

  run_cmd "$dry_run" gcloud services enable compute.googleapis.com --project "$project_id"

  if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud compute addresses describe hjertefrisk-web-ip --project "$project_id" --global; then
    run_cmd "$dry_run" gcloud compute addresses create hjertefrisk-web-ip \
      --project "$project_id" \
      --global \
      --ip-version IPV4
  else
    echo "Global IP already exists: hjertefrisk-web-ip"
  fi

  if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud compute ssl-certificates describe hjertefrisk-web-cert --project "$project_id" --global; then
    run_cmd "$dry_run" gcloud compute ssl-certificates create hjertefrisk-web-cert \
      --project "$project_id" \
      --global \
      --domains "${domain_dev},${domain_stage},${domain_prod}"
  else
    echo "Managed certificate already exists: hjertefrisk-web-cert"
  fi

  local neg_names=(
    hjertefrisk-frontend-dev-neg
    hjertefrisk-backend-dev-neg
    hjertefrisk-frontend-staging-neg
    hjertefrisk-backend-staging-neg
    hjertefrisk-frontend-prod-neg
    hjertefrisk-backend-prod-neg
  )
  local service_names=(
    hjertefrisk-frontend-dev
    hjertefrisk-backend-dev
    hjertefrisk-frontend-staging
    hjertefrisk-backend-staging
    hjertefrisk-frontend-prod
    hjertefrisk-backend-prod
  )
  local backend_service_names=(
    hjertefrisk-frontend-dev-bes
    hjertefrisk-backend-dev-bes
    hjertefrisk-frontend-staging-bes
    hjertefrisk-backend-staging-bes
    hjertefrisk-frontend-prod-bes
    hjertefrisk-backend-prod-bes
  )

  local index
  for index in "${!neg_names[@]}"; do
    if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud compute network-endpoint-groups describe "${neg_names[$index]}" --project "$project_id" --region "$region"; then
      run_cmd "$dry_run" gcloud compute network-endpoint-groups create "${neg_names[$index]}" \
        --project "$project_id" \
        --region "$region" \
        --network-endpoint-type serverless \
        --cloud-run-service "${service_names[$index]}"
    else
      echo "Serverless NEG already exists: ${neg_names[$index]}"
    fi

    if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud compute backend-services describe "${backend_service_names[$index]}" --project "$project_id" --global; then
      run_cmd "$dry_run" gcloud compute backend-services create "${backend_service_names[$index]}" \
        --project "$project_id" \
        --global \
        --load-balancing-scheme EXTERNAL_MANAGED

      run_cmd "$dry_run" gcloud compute backend-services add-backend "${backend_service_names[$index]}" \
        --project "$project_id" \
        --global \
        --network-endpoint-group "${neg_names[$index]}" \
        --network-endpoint-group-region "$region"
    else
      echo "Backend service already exists: ${backend_service_names[$index]}"
    fi
  done

  create_or_update_url_map "$dry_run" "$project_id" "$domain_dev" "$domain_stage" "$domain_prod"

  if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud compute target-https-proxies describe hjertefrisk-web-https-proxy --project "$project_id"; then
    run_cmd "$dry_run" gcloud compute target-https-proxies create hjertefrisk-web-https-proxy \
      --project "$project_id" \
      --url-map hjertefrisk-web-map \
      --ssl-certificates hjertefrisk-web-cert
  else
    run_cmd "$dry_run" gcloud compute target-https-proxies update hjertefrisk-web-https-proxy \
      --project "$project_id" \
      --url-map hjertefrisk-web-map \
      --ssl-certificates hjertefrisk-web-cert
  fi

  if [[ "$dry_run" == "1" ]] || ! resource_exists gcloud compute forwarding-rules describe hjertefrisk-web-https-rule --project "$project_id" --global; then
    run_cmd "$dry_run" gcloud compute forwarding-rules create hjertefrisk-web-https-rule \
      --project "$project_id" \
      --global \
      --load-balancing-scheme EXTERNAL_MANAGED \
      --address hjertefrisk-web-ip \
      --target-https-proxy hjertefrisk-web-https-proxy \
      --ports 443
  else
    echo "HTTPS forwarding rule already exists: hjertefrisk-web-https-rule"
  fi

  echo
  if [[ "$dry_run" == "1" ]]; then
    echo "Load balancer IP: <resolved-on-real-run>"
  else
    echo "Load balancer IP: $(gcloud compute addresses describe hjertefrisk-web-ip --project "$project_id" --global --format='value(address)')"
    echo "Certificate status:"
    gcloud compute ssl-certificates describe hjertefrisk-web-cert \
      --project "$project_id" \
      --global \
      --format='value(managed.status)'
  fi
  echo "Add DNS A records for:"
  echo "  ${domain_dev}"
  echo "  ${domain_stage}"
  echo "  ${domain_prod}"
}

main "$@"
