# Hjertefrisk GCP Terraform Scaffold

This directory is a starting point for a GCP environment for `hjertefrisk` with:

- one VPC
- one subnet
- firewall rules for SSH, HTTP, and HTTPS
- one static external IP
- one Compute Engine VM

This is bootstrap infrastructure, not a final production setup.

## Suggested Usage

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan -var-file=env/dev.tfvars
```

## What Must Be Replaced Before Real Deploy
- real `project_id`
- real SSH public key
- real environment values in `env/*.tfvars`
- the startup script placeholder with project-specific runtime setup

## Notes
- Lock down `ssh_source_cidr` before exposing the environment.
- Add remote state before relying on this for team use.
- Replace repo bootstrap behavior with the real deploy path once the workflow is in place.
