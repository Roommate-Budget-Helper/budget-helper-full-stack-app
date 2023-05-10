# Virtual Private Cloud for Isolating AWS Resources on a network
resource "aws_vpc" "rbh-vpc" {
  cidr_block = "10.0.0.0/16"
}

# Subnets
resource "aws_subnet" "rbh-public-1a" {
  vpc_id            = aws_vpc.rbh-vpc.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "rds-private-subnet-1a" {
  vpc_id            = aws_vpc.rbh-vpc.id
  cidr_block        = "10.0.3.0/25"
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "rbh-public-1b" {
  vpc_id            = aws_vpc.rbh-vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1b"
}

resource "aws_subnet" "rds-private-subnet-1b" {
  vpc_id            = aws_vpc.rbh-vpc.id
  cidr_block        = "10.0.2.0/25"
  availability_zone = "us-east-1b"
}

resource "aws_subnet" "rds-private-subnet-1c" {
  vpc_id            = aws_vpc.rbh-vpc.id
  cidr_block        = "10.0.2.128/25"
  availability_zone = "us-east-1c"
}
resource "aws_subnet" "rds-private-subnet-1d" {
  vpc_id            = aws_vpc.rbh-vpc.id
  cidr_block        = "10.0.4.0/25"
  availability_zone = "us-east-1d"
}
resource "aws_subnet" "rds-private-subnet-1f" {
  vpc_id            = aws_vpc.rbh-vpc.id
  cidr_block        = "10.0.3.128/25"
  availability_zone = "us-east-1f"
}

# Route Table Private
resource "aws_route_table" "RDS-Pvt-rt" {
  vpc_id = aws_vpc.rbh-vpc.id
  route {
    cidr_block = "10.0.0.0/16"
  }
}
# Subnets in Private Route Table
resource "aws_route_table_association" "private-a" {
  subnet_id      = aws_subnet.rds-private-subnet-1a.id
  route_table_id = aws_route_table.RDS-Pvt-rt.id
}
resource "aws_route_table_association" "private-b" {
  subnet_id      = aws_subnet.rds-private-subnet-1b.id
  route_table_id = aws_route_table.RDS-Pvt-rt.id
}
resource "aws_route_table_association" "private-c" {
  subnet_id      = aws_subnet.rds-private-subnet-1c.id
  route_table_id = aws_route_table.RDS-Pvt-rt.id
}
resource "aws_route_table_association" "private-d" {
  subnet_id      = aws_subnet.rds-private-subnet-1d.id
  route_table_id = aws_route_table.RDS-Pvt-rt.id
}
resource "aws_route_table_association" "private-f" {
  subnet_id      = aws_subnet.rds-private-subnet-1f.id
  route_table_id = aws_route_table.RDS-Pvt-rt.id
}

# Internet gateway
resource "aws_internet_gateway" "RBH-public-gateway" {
  vpc_id = aws_vpc.rbh-vpc.id
}

# Public route table
resource "aws_route_table" "RBH-public" {
  vpc_id = aws_vpc.rbh-vpc.id
  route {
    cidr_block = "10.0.0.0/16"
  }
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.RBH-public-gateway.id
  }
}

# Subnet associations
resource "aws_route_table_association" "RBH-public-a" {
  route_table_id = aws_route_table.RBH-public.id
  subnet_id      = aws_subnet.rbh-public-1a.id
}

resource "aws_route_table_association" "RBH-public-b" {
  route_table_id = aws_route_table.RBH-public.id
  subnet_id      = aws_subnet.rbh-public-1b.id
}


output "rds-private-subnet-1a-id" {
  value = aws_subnet.rds-private-subnet-1a.id
}

output "rds-private-subnet-1b-id" {
  value = aws_subnet.rds-private-subnet-1b.id
}

output "rds-private-subnet-1c-id" {
  value = aws_subnet.rds-private-subnet-1c.id
}

output "rds-private-subnet-1d-id" {
  value = aws_subnet.rds-private-subnet-1d.id
}

output "rds-private-subnet-1f-id" {
  value = aws_subnet.rds-private-subnet-1f.id
}

output "rds-public-subnet-1a-id" {
  value = aws_subnet.rbh-public-1a.id
}

output "rds-public-subnet-1b-id" {
  value = aws_subnet.rbh-public-1b.id
}

output "rbh-vpc-id" {
  value = aws_vpc.rbh-vpc.id
}
