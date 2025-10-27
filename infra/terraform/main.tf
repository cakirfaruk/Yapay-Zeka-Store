terraform {
  required_version = ">= 1.5.0"
}

provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "artifacts" {
  bucket = "ai-marketplace-artifacts"
}

variable "region" {
  type    = string
  default = "eu-central-1"
}
