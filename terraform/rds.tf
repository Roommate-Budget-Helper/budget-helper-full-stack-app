resource "random_password" "db-password" {
  length           = 16
  special          = true
  override_special = "^!*"
}

resource "aws_db_subnet_group" "RDS-ec2-db-subnet-group" {
  name       = "maindb"
  subnet_ids = [aws_subnet.rds-private-subnet-1a, aws_subnet.rds-private-subnet-1b, aws_subnet.rds-private-subnet-1c, aws_subnet.rds-private-subnet-1d, aws_subnet.rds-private-subnet-1f]
}


resource "aws_db_instance" "RBH-prod" {
  allocated_storage      = 20
  engine                 = "postgresql"
  engine_version         = "14.6"
  instance_class         = "db.t3.micro"
  username               = "postgres"
  password               = random_password.db-password.result
  db_subnet_group_name   = aws_db_subnet_group.RDS-ec2-db-subnet-group
  storage_encrypted      = true
  storage_type           = "gp3"
  vpc_security_group_ids = [aws_security_group.RBH-rds-ec2]
}

# Security Group to allow db connections
resource "aws_security_group" "RBH-rds-ec2" {
  name        = "rds-ec2"
  description = "Security group attached to RBH to allow EC2 instances with specific security groups attached to connect to the database. Modification could lead to connection loss."
  vpc_id      = aws_vpc.rbh-vpc
}

resource "aws_security_group" "RBH-ec2-rds" {
  name        = "ec2-rds"
  description = "Security group attached to instances to securely connect to RBH. Modification could lead to connection loss."
  vpc_id      = aws_vpc.rbh-vpc
}


resource "aws_security_group_rule" "postgres-traffic-in" {
  security_group_id        = aws_security_group.RBH-rds-ec2
  type                     = "ingress"
  description              = "Rule to allow connections from EC2 instances with ${aws_security_group.RBH-ec2-rds} attached"
  source_security_group_id = aws_security_group.RBH-ec2-rds
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "postgres-traffic-out" {
  security_group_id        = aws_security_group.RBH-ec2-rds
  type                     = "egress"
  description              = "Rule to allow connections to RBH from any instances this security group is attached to"
  source_security_group_id = aws_security_group.RBH-rds-ec2
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
}

output "DATABASE_URL" {
  value     = "postgresql://${aws_db_instance.RBH-prod.username}:${random_password.db-password.result}@${aws_db_instance.RBH-prod.endpoint}"
  sensitive = true
}