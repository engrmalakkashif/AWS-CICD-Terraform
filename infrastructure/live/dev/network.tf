data "aws_availability_zones" "available" {
  state = "available"
}

check "enough_availability_zones" {
  assert {
    condition     = length(data.aws_availability_zones.available.names) >= var.availability_zone_count
    error_message = "The selected region has fewer available AZs than availability_zone_count."
  }
}

locals {
  availability_zones = slice(
    data.aws_availability_zones.available.names,
    0,
    var.availability_zone_count
  )

  subnet_cidrs_by_tier = {
    public      = var.subnet_cidrs.public
    application = var.subnet_cidrs.application
    database    = var.subnet_cidrs.database
  }

  subnets = merge([
    for tier, cidrs in local.subnet_cidrs_by_tier : {
      for index, zone in local.availability_zones : "${tier}-${index + 1}" => {
        tier = tier
        az   = zone
        cidr = cidrs[index]
      }
    }
  ]...)

  route_table_tiers = toset(["public", "application", "database"])

  common_tags = {
    Project            = var.project_name
    Environment        = var.environment
    Owner              = var.owner
    CostCenter         = var.cost_center
    DataClassification = var.data_classification
    ManagedBy          = "terraform"
  }
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "${var.project_name}-${var.environment}-igw"
  }
}

resource "aws_subnet" "this" {
  for_each = local.subnets

  vpc_id                  = aws_vpc.this.id
  cidr_block              = each.value.cidr
  availability_zone       = each.value.az
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project_name}-${var.environment}-${each.key}"
    Tier = each.value.tier
  }
}

resource "aws_route_table" "tier" {
  for_each = local.route_table_tiers
  vpc_id   = aws_vpc.this.id

  tags = {
    Name = "${var.project_name}-${var.environment}-${each.key}-rt"
    Tier = each.key
  }
}

resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.tier["public"].id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}

resource "aws_route_table_association" "subnets" {
  for_each = local.subnets

  subnet_id      = aws_subnet.this[each.key].id
  route_table_id = aws_route_table.tier[each.value.tier].id
}
