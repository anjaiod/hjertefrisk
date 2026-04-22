# Terraform

This folder is split by deployment target so each environment stays explicit:

- `gcp/`

Recommended workflow:

1. Copy the relevant `env/*.tfvars.example` file.
2. Fill in real values.
3. Run `terraform init`.
4. Run `terraform fmt -recursive`.
5. Run `terraform validate`.
6. Run `terraform plan -var-file=env/<environment>.tfvars`.

Do not commit Terraform state files.
