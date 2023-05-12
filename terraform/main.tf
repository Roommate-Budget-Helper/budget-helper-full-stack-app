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
  vpc-id       = module.vpc.rbh-vpc-id
  subnet-1a-id = module.vpc.rds-private-subnet-1a-id
  subnet-1b-id = module.vpc.rds-private-subnet-1b-id
  subnet-1c-id = module.vpc.rds-private-subnet-1c-id
  subnet-1d-id = module.vpc.rds-private-subnet-1d-id
  subnet-1f-id = module.vpc.rds-private-subnet-1f-id
}

module "vpc" {
  source = "./vpc"
}

output "DATABASE_URL" {
  value     = module.rds.DATABASE_URL
  sensitive = true
}

output "S3_BUCKET_NAME" {
  value = aws_s3_bucket.rbh-bucket.bucket
}
