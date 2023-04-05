resource "aws_vpc" "rbh-vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "rbh-public-1a" {
  vpc_id            = aws_vpc.rbh-vpc
  cidr_block        = "10.0.0.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "rds-private-subnet-1a" {
  vpc_id            = aws_vpc.rbh-vpc
  cidr_block        = "10.0.3.0/25"
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "rbh-public-1b" {
  vpc_id            = aws_vpc.rbh-vpc
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1b"
}

resource "aws_subnet" "rds-private-subnet-1b" {
  vpc_id            = aws_vpc.rbh-vpc
  cidr_block        = "10.0.2.0/25"
  availability_zone = "us-east-1b"
}

resource "aws_subnet" "rds-private-subnet-1c" {
  vpc_id            = aws_vpc.rbh-vpc
  cidr_block        = "10.0.2.128/25"
  availability_zone = "us-east-1c"
}
resource "aws_subnet" "rds-private-subnet-1d" {
  vpc_id            = aws_vpc.rbh-vpc
  cidr_block        = "10.0.4.0/25"
  availability_zone = "us-east-1d"
}
resource "aws_subnet" "rds-private-subnet-1f" {
  vpc_id            = aws_vpc.rbh-vpc
  cidr_block        = "10.0.3.128/25"
  availability_zone = "us-east-1f"
}
