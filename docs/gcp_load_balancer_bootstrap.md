# GCP Load Balancer Bootstrap

Script:
- `scripts/bootstrap_gcp_load_balancer.sh`

This script bootstraps the Google Cloud HTTPS load balancer for:
- `hjertefrisk-dev.naerverk.no`
- `hjertefrisk-stage.naerverk.no`
- `hjertefrisk.naerverk.no`

It assumes these Cloud Run services already exist:
- `hjertefrisk-frontend-dev`
- `hjertefrisk-backend-dev`
- `hjertefrisk-frontend-staging`
- `hjertefrisk-backend-staging`
- `hjertefrisk-frontend-prod`
- `hjertefrisk-backend-prod`

## What It Creates
- one global static IPv4 address: `hjertefrisk-web-ip`
- one Google-managed certificate: `hjertefrisk-web-cert`
- one serverless NEG per Cloud Run service
- one backend service per NEG
- one URL map: `hjertefrisk-web-map`
- one HTTPS target proxy: `hjertefrisk-web-https-proxy`
- one global forwarding rule on port `443`: `hjertefrisk-web-https-rule`

## Routing
For each host:
- `/api` and `/api/*` -> backend
- `/health` and `/health/*` -> backend
- `/swagger` and `/swagger/*` -> backend
- everything else -> frontend

## Dry Run

```bash
bash scripts/bootstrap_gcp_load_balancer.sh \
  --project-id hjertefrisk \
  --dry-run
```

## Real Run

```bash
bash scripts/bootstrap_gcp_load_balancer.sh \
  --project-id hjertefrisk
```

## After The Script
1. Copy the printed load balancer IP.
2. Add DNS `A` records:
   - `hjertefrisk-dev.naerverk.no`
   - `hjertefrisk-stage.naerverk.no`
   - `hjertefrisk.naerverk.no`
3. Wait for the managed certificate to move from `PROVISIONING` to `ACTIVE`.
4. When routing is stable, restrict Cloud Run ingress to `Internal and Cloud Load Balancing`.

## Notes
- DNS is intentionally manual because it lives outside GCP.
- The script is idempotent enough for repeated bootstrap/update runs.
- It updates the URL map and HTTPS proxy if they already exist.
