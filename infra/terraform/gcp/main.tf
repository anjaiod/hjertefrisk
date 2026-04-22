locals {
  name_prefix = "${var.project_name}-${var.environment}"
  default_tags = [
    "${var.project_name}-${var.environment}",
    "ssh",
    "web"
  ]
}

resource "google_compute_network" "main" {
  name                    = "${local.name_prefix}-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "main" {
  name          = "${local.name_prefix}-subnet"
  ip_cidr_range = var.network_cidr
  region        = var.region
  network       = google_compute_network.main.id
}

resource "google_compute_firewall" "ssh" {
  name    = "${local.name_prefix}-allow-ssh"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = [var.ssh_source_cidr]
  target_tags   = ["ssh"]
}

resource "google_compute_firewall" "web" {
  name    = "${local.name_prefix}-allow-web"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = [var.web_source_cidr]
  target_tags   = ["web"]
}

resource "google_compute_address" "main" {
  name   = "${local.name_prefix}-ip"
  region = var.region
}

resource "google_compute_instance" "main" {
  name         = var.vm_name
  machine_type = var.machine_type
  zone         = var.zone
  tags         = distinct(concat(local.default_tags, var.instance_tags))

  boot_disk {
    initialize_params {
      image = var.boot_image
      size  = 30
      type  = "pd-standard"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.main.id

    access_config {
      nat_ip = google_compute_address.main.address
    }
  }

  metadata = {
    ssh-keys = "${var.admin_username}:${trimspace(var.ssh_public_key)}"
  }

  metadata_startup_script = templatefile("${path.module}/templates/startup.sh.tftpl", {
    admin_username    = var.admin_username
    repository_url    = var.repository_url
    repository_branch = var.repository_branch
  })
}
