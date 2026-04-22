output "project_id" {
  description = "GCP project ID."
  value       = var.project_id
}

output "vm_public_ip" {
  description = "Public IP address for the VM."
  value       = google_compute_address.main.address
}

output "network_name" {
  description = "VPC network name."
  value       = google_compute_network.main.name
}

output "ssh_command" {
  description = "Convenience SSH command."
  value       = "gcloud compute ssh ${var.admin_username}@${google_compute_instance.main.name} --project ${var.project_id} --zone ${var.zone}"
}
