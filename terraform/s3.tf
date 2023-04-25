resource "aws_s3_bucket" "rbh-bucket" {
  bucket_prefix = "rbh-prod-bucket"
}

resource "aws_s3_bucket_cors_configuration" "rbh-cors" {
  bucket = aws_s3_bucket.rbh-bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }
}
