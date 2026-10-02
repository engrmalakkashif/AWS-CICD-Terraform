variable "aws_region" {
  description = "Approved AWS region for this environment."
  type        = string
}

variable "project_name" {
  description = "Short name used in resource names."
  type        = string
  default     = "healthcare-api"
}

variable "environment" {
  description = "Environment name; this root is intended for development only."
  type        = string
  default     = "dev"

  validation {
    condition     = var.environment == "dev"
    error_message = "This root module is for dev only; create a separate reviewed root for other environments."
  }
}

variable "owner" {
  description = "Team or person accountable for this environment."
  type        = string
}

variable "cost_center" {
  description = "Approved cost-center identifier."
  type        = string
}

variable "data_classification" {
  description = "Data classification for resources in this environment."
  type        = string
  default     = "synthetic"
}

variable "vpc_cidr" {
  description = "VPC CIDR, which must not overlap connected networks."
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidrs" {
  description = "One subnet CIDR per requested AZ for each network tier."
  type = object({
    public      = list(string)
    application = list(string)
    database    = list(string)
  })
  default = {
    public      = ["10.0.1.0/24", "10.0.2.0/24"]
    application = ["10.0.11.0/24", "10.0.12.0/24"]
    database    = ["10.0.21.0/24", "10.0.22.0/24"]
  }

  validation {
    condition = alltrue([
      length(var.subnet_cidrs.public) == var.availability_zone_count,
      length(var.subnet_cidrs.application) == var.availability_zone_count,
      length(var.subnet_cidrs.database) == var.availability_zone_count
    ])
    error_message = "Each subnet tier must provide exactly one CIDR per selected Availability Zone."
  }
}

variable "availability_zone_count" {
  description = "Number of available AZs to use."
  type        = number
  default     = 2

  validation {
    condition     = var.availability_zone_count >= 2 && var.availability_zone_count <= 3
    error_message = "Use two or three AZs for this reference network."
  }
}
