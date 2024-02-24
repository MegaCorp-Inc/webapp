packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.1.4"
    }
  }
}

source "googlecompute" "centos-8" {
  project_id          = "${var.project_id}"
  source_image_family = "${var.source_image_family}"
  image_name          = "${var.image_name}${local.timestamp}"
  zone          = "${var.zone}"
  ssh_username        = "${var.ssh_username}"
  disk_size           = "${var.disk_size}"
  disk_type           = "pd-balanced"
  machine_type        = "${var.machine_type}"
}

build {
  sources = ["source.googlecompute.centos-8"]

  provisioner "file" {
    source      = "${var.sourceArtifact}"
    destination = "${var.destinationArtifact}"
  }

  provisioner "file" {
    source      = "packer/csye6225.service"
    destination = "/tmp/csye6225.service"
  }

  provisioner "shell" {
    scripts = "${var.scripts}"
  }

}
