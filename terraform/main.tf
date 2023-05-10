terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "rds" {
  source = "./rds"
  depends_on = [
    module.vpc
  ]
}

module "vpc" {
  source = "./vpc"
}
