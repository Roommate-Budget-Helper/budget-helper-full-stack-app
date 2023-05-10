resource "aws_ecr_repository" "rbh-ecr" {
  name                 = "rbh-app"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "ecr-repo" {
  value = aws_ecr_repository.rbh-ecr.repository_url
}
