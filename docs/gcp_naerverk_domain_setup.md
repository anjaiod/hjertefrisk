# GCP Setup For `naerverk.no` Domains

This guide describes what must be configured in Google Cloud and DNS to support:

- `hjertefrisk-dev.naerverk.no`
- `hjertefrisk-stage.naerverk.no`
- `hjertefrisk.naerverk.no`

## Recommended Architecture
Use:
- Cloud Run for backend and frontend services
- Google Artifact Registry for container images
- one **global external Application Load Balancer**
- serverless NEGs that point to Cloud Run services
- Google-managed SSL certificate for the three hostnames

This is the recommended custom-domain path for Cloud Run. Google’s Cloud Run documentation explicitly recommends using a global external Application Load Balancer for custom domains, and notes that it allows path-based routing. Sources:
- https://cloud.google.com/run/docs/mapping-custom-domains
- https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless
- https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs

## Why This Shape Fits This Repository
You only asked for frontend domains:
- `hjertefrisk-dev.naerverk.no`
- `hjertefrisk-stage.naerverk.no`
- `hjertefrisk.naerverk.no`

The cleanest way to support that without separate API subdomains is:
- route normal page traffic to the frontend service
- route `/api/*`, `/health/*`, and `/swagger/*` to the backend service

That lets frontend requests use the same origin as the site.

## Google Cloud Setup Checklist

### 1. Project and billing
- Create or select the Google Cloud project for deployment.
- Enable billing.

### 2. Enable APIs
Enable at least:
- Cloud Run Admin API
- Artifact Registry API
- IAM API
- IAM Credentials API
- Security Token Service API
- Service Usage API
- Compute Engine API

The Compute Engine API is needed because the load balancer, global IP, SSL certificate, and serverless NEGs live under Google Cloud load balancing / compute resources.

For Workload Identity Federation with GitHub Actions, Google documents enabling IAM, Resource Manager, Service Account Credentials, and Security Token Service APIs:
- https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines

The repository includes `scripts/bootstrap_gcp_for_github_actions.sh` to automate this part.

### 3. Create Artifact Registry
Create one Docker repository, for example:
- region: `europe-west1`
- repository name: `hjertefrisk`

This is where the GitHub Actions deploy workflow pushes backend and frontend images.

### 4. Create a deploy service account
Create a service account for GitHub Actions, for example:
- `github-actions@<project-id>.iam.gserviceaccount.com`

Grant it the minimum roles needed for this workflow. A practical starting point is:
- `roles/run.admin`
- `roles/artifactregistry.writer`
- `roles/iam.serviceAccountUser`

If the workflow also needs to read or manage additional load balancer resources later, add those roles separately instead of over-broad project ownership.

### 5. Configure Workload Identity Federation for GitHub
Create:
- one workload identity pool
- one OIDC provider for GitHub Actions

Recommended attribute mapping:
- `google.subject=assertion.sub`

Recommended attribute condition:
- restrict to the `Naerverk` GitHub organization
- optionally restrict to this repository

Google’s guide for GitHub Actions OIDC:
- https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines

### 6. Allow the provider to impersonate the deploy service account
Grant the federated GitHub principal access to impersonate the service account used by the workflow.

This is what makes:
- `google-github-actions/auth`
- GitHub OIDC
- short-lived GCP credentials

work without storing a JSON key in GitHub.

### 7. Bootstrap GitHub environments
Create and populate:
- `dev`
- `staging`
- `prod`

Use:

```bash
scripts/bootstrap_github_cloud_run_env.sh dev
scripts/bootstrap_github_cloud_run_env.sh staging
scripts/bootstrap_github_cloud_run_env.sh prod
```

## Cloud Run Services To Create

### Dev
- backend: `hjertefrisk-backend-dev`
- frontend: `hjertefrisk-frontend-dev`

### Stage
- backend: `hjertefrisk-backend-staging`
- frontend: `hjertefrisk-frontend-staging`

### Prod
- backend: `hjertefrisk-backend-prod`
- frontend: `hjertefrisk-frontend-prod`

The current workflow deploys these from GitHub Actions.

## Domain Plan

### Public domains
- `hjertefrisk-dev.naerverk.no`
- `hjertefrisk-stage.naerverk.no`
- `hjertefrisk.naerverk.no`

### Routing strategy
Use host rules and path rules in the load balancer:

For host `hjertefrisk-dev.naerverk.no`:
- `/api/*` -> `hjertefrisk-backend-dev`
- `/health/*` -> `hjertefrisk-backend-dev`
- `/swagger/*` -> `hjertefrisk-backend-dev`
- everything else -> `hjertefrisk-frontend-dev`

For host `hjertefrisk-stage.naerverk.no`:
- `/api/*` -> `hjertefrisk-backend-staging`
- `/health/*` -> `hjertefrisk-backend-staging`
- `/swagger/*` -> `hjertefrisk-backend-staging`
- everything else -> `hjertefrisk-frontend-staging`

For host `hjertefrisk.naerverk.no`:
- `/api/*` -> `hjertefrisk-backend-prod`
- `/health/*` -> `hjertefrisk-backend-prod`
- `/swagger/*` -> `hjertefrisk-backend-prod`
- everything else -> `hjertefrisk-frontend-prod`

## How To Create The Domains

The repository now includes a bootstrap script for the Google Cloud side of this setup:

```bash
scripts/bootstrap_gcp_load_balancer.sh --project-id hjertefrisk --dry-run
scripts/bootstrap_gcp_load_balancer.sh --project-id hjertefrisk
```

It creates:
- one global static IP
- one managed certificate
- one serverless NEG per Cloud Run service
- one backend service per NEG
- one URL map with host and path routing
- one HTTPS target proxy
- one HTTPS forwarding rule

It does not create DNS records at the `naerverk.no` provider. That remains manual.

### Step 1. Deploy Cloud Run services first
Deploy the six Cloud Run services first:
- dev frontend/backend
- stage frontend/backend
- prod frontend/backend

The load balancer backends point to Cloud Run services, so the services must exist before you wire the final routing.

### Step 2. Reserve one global static external IP
Create one global IPv4 address for the load balancer frontend.

Google’s load balancer guide recommends using a static external IP, and it is required in practice for predictable DNS and managed certificates:
- https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless

### Step 3. Create one Google-managed SSL certificate
Create one certificate containing:
- `hjertefrisk-dev.naerverk.no`
- `hjertefrisk-stage.naerverk.no`
- `hjertefrisk.naerverk.no`

Google-managed certificates are appropriate here because Google provisions and renews them automatically:
- https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs

### Step 4. Create serverless NEGs
Create one serverless NEG per Cloud Run service:
- frontend-dev
- backend-dev
- frontend-staging
- backend-staging
- frontend-prod
- backend-prod

Each NEG points at the matching Cloud Run service in the selected region.

### Step 5. Create backend services
Create backend services that use those NEGs.

Practical layout:
- one backend service per frontend Cloud Run service
- one backend service per backend Cloud Run service

### Step 6. Create URL map with host and path routing
Create:
- host rule for `hjertefrisk-dev.naerverk.no`
- host rule for `hjertefrisk-stage.naerverk.no`
- host rule for `hjertefrisk.naerverk.no`

Then add path matchers so `/api/*`, `/health/*`, and `/swagger/*` go to backend for that environment, with default route to frontend.

### Step 7. Create HTTPS target proxy and forwarding rule
Attach:
- the URL map
- the managed certificate
- the global static IP

This completes the public HTTPS frontend.

### Step 8. Add DNS records in `naerverk.no`
At the DNS provider for `naerverk.no`, add three `A` records pointing to the load balancer IP:

- `hjertefrisk-dev` -> `<global-lb-ip>`
- `hjertefrisk-stage` -> `<global-lb-ip>`
- `hjertefrisk` -> `<global-lb-ip>`

Google’s load balancer docs describe creating `A` records that point each hostname to the load balancer IP:
- https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless

### Step 9. Wait for certificate provisioning
The Google-managed certificate will remain in `PROVISIONING` until:
- the certificate is attached to the load balancer
- the DNS `A` records point to the load balancer IP

It can take hours, and Google documents that global DNS propagation can sometimes take up to 72 hours:
- https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs

### Step 10. Lock down Cloud Run ingress
After the load balancer is working, change the Cloud Run services so external traffic goes through the load balancer instead of directly through `run.app`.

Google recommends restricting ingress to `Internal and Cloud Load Balancing` so users cannot bypass the load balancer:
- https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless

Also consider disabling the default Cloud Run URL once the load balancer path is stable.

## Practical Rollout Order

### Phase 1
- Get `dev` working on raw `run.app` URLs
- Verify backend migrations, Supabase connectivity, and frontend rendering

### Phase 2
- Build the load balancer for `dev`
- Point `hjertefrisk-dev.naerverk.no` to the load balancer
- Update `dev.vars` so `NEXT_PUBLIC_API_URL` and `API_URL_INTERNAL` stay on the custom domain

### Phase 3
- Repeat for `stage`
- Add `hjertefrisk-stage.naerverk.no`

### Phase 4
- Create prod services
- Add `hjertefrisk.naerverk.no`
- Cut over production when ready

## Make Ready For `hjertefrisk.naerverk.no`
To be ready for production now, even before cutover:
- include `hjertefrisk.naerverk.no` in the managed certificate
- create prod backend/frontend Cloud Run services
- add the prod host rule and path matcher to the load balancer
- add the DNS `A` record only when you are ready to expose prod

That lets you prepare all Google resources in advance and delay only the DNS cutover.
