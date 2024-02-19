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
  image_name          = "${var.image_name}"
  zone                = "${var.zone}"
  ssh_username        = "${var.ssh_username}"
  machine_type        = "${var.machine_type}"
  disk_size           = "${var.disk_size}"
  network             = "${var.network}"
  subnetwork          = "${var.subnet}"
  account_file        = "${var.account_file}"
}

build {
  sources = ["source.googlecompute.centos-8"]
  provisioner "shell" {
    scripts = ["scripts/updateOS.sh", "scripts/environtmentSetup.sh", "scripts/pgmethodUpdate.sh"]
  }
}
