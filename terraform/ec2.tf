# Security group to allow web traffic
resource "aws_security_group" "ECS-web" {
  name        = "ECS-rbh-web-production"
  description = "ECS Allowed Ports"
  vpc_id      = aws_vpc.rbh-vpc
}

resource "aws_security_group_rule" "nginx-rule" {
  security_group_id = aws_security_group.ECS-web
  type              = "ingress"
  protocol          = "tcp"
  from_port         = "81"
  to_port           = "81"
  cidr_blocks       = "0.0.0.0/0"
  description       = "Nginx Reverse Proxy"
}

resource "aws_security_group_rule" "ssl-rule" {
  security_group_id = aws_security_group.ECS-web
  type              = "ingress"
  protocol          = "tcp"
  from_port         = "443"
  to_port           = "443"
  cidr_blocks       = "0.0.0.0/0"
  description       = "HTTPS traffic"
}

resource "aws_security_group_rule" "app-rule" {
  security_group_id = aws_security_group.ECS-web
  type              = "ingress"
  protocol          = "tcp"
  from_port         = "3000"
  to_port           = "3000"
  cidr_blocks       = "0.0.0.0/0"
  description       = "App port"
}

resource "aws_security_group_rule" "http-rule" {
  security_group_id = aws_security_group.ECS-web
  type              = "ingress"
  protocol          = "tcp"
  from_port         = "80"
  to_port           = "80"
  cidr_blocks       = "0.0.0.0/0"
  description       = "HTTP rule"
}

resource "aws_security_group_rule" "ssh-rule" {
  security_group_id = aws_security_group.ECS-web
  type              = "ingress"
  protocol          = "tcp"
  from_port         = "22"
  to_port           = "22"
  cidr_blocks       = "0.0.0.0/0"
  description       = "ssh"
}

resource "aws_security_group_rule" "outbound-all" {
  security_group_id = aws_security_group.ECS-web
  type              = "egress"
  protocol          = "all"
  from_port         = 0
  to_port           = 65535
  description       = "All outbound traffic"
}

resource "aws_instance" "RBH-server" {
  ami                         = "ami-083cd4eb32643c8a0"
  instance_type               = "t2.micro"
  vpc_security_group_ids      = [aws_security_group.RBH-ec2-rds, aws_security_group.ECS-web]
  associate_public_ip_address = true
}

# elastic ip

resource "aws_eip" "RBH-web-ip" {
  instance = aws_instance.RBH-server
  vpc      = true
}

resource "aws_network_interface" "RBH-server-eni" {
  subnet_id       = aws_subnet.rbh-public-1b
  security_groups = [aws_security_group.RBH-ec2-rds, aws_security_group.ECS-web]
  attachment {
    instance     = aws_instance.RBH-server
    device_index = 1
  }
}


resource "aws_autoscaling_group" "EC2ServiceGroup" {
  name                      = "rbh-ecs"
  max_size                  = 1
  min_size                  = 1
  desired_capacity          = 1
  health_check_grace_period = 0
  health_check_type         = "EC2"
  force_delete              = true
  vpc_zone_identifier       = [aws_subnet.rbh-public-1a, aws_subnet.rbh-public-1a]
  launch_template {
    id      = aws_launch_template.ecs-ec2
    version = "$Latest"
  }
}

resource "aws_launch_template" "ecs-ec2" {
  name_prefix            = "rbh"
  image_id               = "ami-083cd4eb32643c8a0"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.RBH-ec2-rds, aws_security_group.ECS-web]
}
