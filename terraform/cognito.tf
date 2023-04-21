
resource "aws_cognito_user_pool" "rbh-cognito" {
  name             = "rbh-production-users"
  alias_attributes = ["email", "preffered_username"]
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 3
  }
}


resource "aws_cognito_user_pool_client" "webapp" {
  name                                 = "rbh-prod"
  user_pool_id                         = aws_cognito_user_pool.rbh-cognito.id
  callback_urls                        = ["${var.url}/api/auth/credentials"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit", "client_credentials"]
  allowed_oauth_scopes                 = ["email", "profile", "openid", "phone"]
  supported_identity_providers         = ["COGNITO"]
}

output "COGNITO_CLIENT_ID" {
  value = aws_cognito_user_pool_client.webapp.id
}

output "COGNITO_USER_POOL" {
  value = aws_cognito_user_pool.rbh-cognito.id
}
