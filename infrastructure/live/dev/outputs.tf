output "vpc_id" {
  description = "VPC ID for the dev environment."
  value       = aws_vpc.this.id
}

output "subnet_ids_by_tier" {
  description = "Subnet IDs grouped by public, application, and database tier."
  value = {
    for tier in local.route_table_tiers : tier => [
      for key, subnet in aws_subnet.this : subnet.id if local.subnets[key].tier == tier
    ]
  }
}

output "availability_zones" {
  description = "Availability Zones used by the dev network."
  value       = local.availability_zones
}
