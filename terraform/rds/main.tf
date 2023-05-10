module "vpc" {
  source = "../vpc"
}


resource "random_password" "db-password" {
  length           = 16
  special          = true
  override_special = "^!*"
}

resource "aws_db_subnet_group" "RDS-ec2-db-subnet-group" {
  name       = "maindb"
  subnet_ids = [module.vpc.rds-private-subnet-1a-id, module.vpc.rds-private-subnet-1b-id, module.vpc.rds-private-subnet-1c-id, module.vpc.rds-private-subnet-1d-id, module.vpc.rds-private-subnet-1f-id]
}


resource "aws_db_instance" "RBH-prod" {
  allocated_storage      = 20
  engine                 = "postgresql"
  engine_version         = "14.6"
  instance_class         = "db.t3.micro"
  username               = "postgres"
  password               = random_password.db-password.result
  db_subnet_group_name   = aws_db_subnet_group.RDS-ec2-db-subnet-group.name
  storage_encrypted      = true
  storage_type           = "gp3"
  vpc_security_group_ids = [aws_security_group.RBH-rds-ec2.id]
}

# Security Group to allow db connections
resource "aws_security_group" "RBH-rds-ec2" {
  name        = "rds-ec2"
  description = "Security group attached to RBH to allow EC2 instances with specific security groups attached to connect to the database. Modification could lead to connection loss."
  vpc_id      = module.vpc.rbh-vpc-id
}

resource "aws_security_group" "RBH-ec2-rds" {
  name        = "ec2-rds"
  description = "Security group attached to instances to securely connect to RBH. Modification could lead to connection loss."
  vpc_id      = module.vpc.rbh-vpc-id
}


resource "aws_security_group_rule" "postgres-traffic-in" {
  security_group_id        = aws_security_group.RBH-rds-ec2.id
  type                     = "ingress"
  description              = "Rule to allow connections from EC2 instances with ${aws_security_group.RBH-ec2-rds.id} attached"
  source_security_group_id = aws_security_group.RBH-ec2-rds.id
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "postgres-traffic-out" {
  security_group_id        = aws_security_group.RBH-ec2-rds.id
  type                     = "egress"
  description              = "Rule to allow connections to RBH from any instances this security group is attached to"
  source_security_group_id = aws_security_group.RBH-rds-ec2.id
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
}

output "DATABASE_URL" {
  value     = "postgresql://${aws_db_instance.RBH-prod.username}:${random_password.db-password.result}@${aws_db_instance.RBH-prod.endpoint}"
  sensitive = true
}


output "sg-RBH-ec2-rds" {
  value = aws_security_group.RBH-ec2-rds.id
}
