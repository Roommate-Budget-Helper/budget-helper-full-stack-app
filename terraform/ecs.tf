resource "aws_ecs_cluster" "web-cluster" {
  name = "rbh-web-production"
}

resource "aws_ecs_cluster_capacity_providers" "web-cluster-providers" {
  cluster_name       = aws_ecs_cluster.web-cluster.name
  capacity_providers = [aws_ecs_capacity_provider.asg-provider.name]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.asg-provider.name
  }
}

resource "aws_ecs_capacity_provider" "asg-provider" {
  name = "asg-provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.EC2ServiceGroup.arn
    managed_termination_protection = "ENABLED"
    managed_scaling {
      target_capacity = 1
    }
  }
}

resource "random_password" "next-auth-secret" {
  length           = 32
  special          = true
  override_special = "^!*@:"
}

data "template_file" "task_definition" {
  template = file("./task_definition.json.tpl")
  vars = {
    CONTAINER_IMAGE = "${aws_ecr_repository.rbh-ecr.repository_url}:latest"
    DATABASE_URL    = module.rds.DATABASE_URL
    GOOGLE_ID       = var.GOOGLE_ID
    GOOGLE_SECRET   = var.GOOGLE_SECRET
    SECRET          = random_password.next-auth-secret.result
    COGNITO_POOL_ID = aws_cognito_user_pool.rbh-cognito.id
    URL             = var.url
    S3_BUCKET_NAME  = aws_s3_bucket.rbh-bucket.id
    CLIENT_ID       = aws_cognito_user_pool_client.webapp.id
  }
}

resource "aws_ecs_task_definition" "task" {
  family                   = "RBH"
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs.arn
  requires_compatibilities = ["EC2"]
  container_definitions = jsonencode(
    jsondecode(
      data.template_file.task_definition.rendered
    ).containerDefinitions
  )
}

resource "aws_iam_role" "ecs" {
  name                = "ecsTaskExecutionRole"
  managed_policy_arns = ["arn:aws:iam::aws:policy/AmazonRDSFullAccess", "arn:aws:iam::aws:policy/AmazonSESFullAccess", "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"]
  assume_role_policy = jsonencode({
    Version = "2008-10-17"
    Statement = [{
      Sid    = "",
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
      Action = ["sts:AssumeRole", aws_iam_policy.s3_partial.arn]
    }]
  })
}


resource "aws_iam_policy" "s3_partial" {
  name = "S3PartialAccess"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid      = "VisualEditor0"
      Effect   = "Allow"
      Action   = ["s3:Put*", "s3:Get*", "s3:List*", "s3:Delete*"]
      Resource = ["arn:aws:s3:::bucket/*", "arn:aws:s3:::bucket"]
      }, {
      Sid      = "VisualEditor1"
      Effect   = "Allow"
      Action   = ["s3:ListAllMyBuckets"],
      Resource = ["*"]
    }]
  })
}

resource "aws_ecs_service" "rbh-web" {
  name            = "rbh-web"
  cluster         = aws_ecs_cluster.web-cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1
}

