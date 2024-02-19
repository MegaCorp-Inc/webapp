variable "project_id" {
  description = "The project id"
  type        = string
  default     = "megamindcorp"
}

variable "image_name" {
  description = "The image name"
  type        = string
  default     = "webapp-centos-stream-8-a3-v2"
}

variable "source_image_family" {
  description = "The source image family"
  type        = string
  default     = "centos-stream-8"
}

variable "machine_type" {
  description = "The machine type"
  type        = string
  default     = "e2-micro"
}

variable "zone" {
  description = "The zone"
  type        = string
  default     = "us-east1-b"
}

variable "disk_size" {
  description = "The disk size"
  type        = number
  default     = 20
}

variable "ssh_username" {
  description = "The ssh username"
  type        = string
  default     = "centos"
}

variable "network" {
  description = "The network"
  type        = string
  default     = "default"
}

variable "subnet" {
  description = "The subnet"
  type        = string
  default     = "default"
}

variable "account_file" {
  description = "The service account"
  type        = string
  default     = env("GOOGLE_SERVICE_ACCOUNT")
}
