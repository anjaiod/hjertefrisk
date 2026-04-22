variable "project_name" {
  description = "Short project name used in resource names."
  type        = string
  default     = "hjertefrisk"
}

variable "environment" {
  description = "Environment name such as dev, staging, or prod."
  type        = string
}

variable "project_id" {
  description = "GCP project ID."
  type        = string
}

variable "region" {
  description = "GCP region."
  type        = string
  default     = "europe-west1"
}

variable "zone" {
  description = "GCP zone."
  type        = string
  default     = "europe-west1-b"
}

variable "network_cidr" {
  description = "CIDR for the application subnet."
  type        = string
  default     = "10.20.1.0/24"
}

variable "vm_name" {
  description = "Compute Engine VM name."
  type        = string
}

variable "machine_type" {
  description = "Compute Engine machine type."
  type        = string
  default     = "e2-medium"
}

variable "admin_username" {
  description = "Admin username for SSH metadata."
  type        = string
  default     = "deployer"
}

variable "ssh_public_key" {
  description = "SSH public key contents."
  type        = string
}

variable "ssh_source_cidr" {
  description = "CIDR allowed to SSH to the VM."
  type        = string
  default     = "0.0.0.0/0"
}

variable "web_source_cidr" {
  description = "CIDR allowed to access HTTP and HTTPS."
  type        = string
  default     = "0.0.0.0/0"
}

variable "boot_image" {
  description = "Boot image for the VM."
  type        = string
  default     = "projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts"
}

variable "repository_url" {
  description = "Repository URL cloned by the startup script."
  type        = string
  default     = "https://github.com/Naerverk/hjertefrisk.git"
}

variable "repository_branch" {
  description = "Repository branch checked out by the startup script."
  type        = string
  default     = "main"
}

variable "instance_tags" {
  description = "Additional network tags for the instance."
  type        = list(string)
  default     = []
}
