# Infrastructure

`live/dev` is the first Terraform implementation slice: one VPC, public ingress subnets, private application subnets, isolated database subnets, and AZ-aware route-table associations. It does not create NAT Gateways, ECS, RDS, WAF, or other billable runtime services yet. No resources have been applied.

## Prerequisites

- Terraform `>= 1.10.0, < 2.0.0` and the AWS provider selected by the checked-in lock file.
- An approved AWS account and region; the region must provide at least two available AZs.
- AWS credentials from an approved federated or local profile, not embedded access keys.
- Owner and cost-center values for resource tags.

## Initialize and validate

From the repository root:

```bash
terraform -chdir=infrastructure/live/dev init -backend=false
terraform -chdir=infrastructure/live/dev fmt -check
terraform -chdir=infrastructure/live/dev validate
```

Before planning, create a local `terraform.tfvars` (ignored by Git) with approved non-secret values:

```hcl
aws_region = "eu-central-1"
owner      = "platform-team"
cost_center = "replace-with-approved-cost-center"
```

Review CIDRs for overlap and use the approved region. A real plan requires AWS credentials and may query AWS for available AZs:

```bash
terraform -chdir=infrastructure/live/dev plan
```

This starter has no remote backend configured yet. Do not apply from a shared or production account. The remote state bootstrap and CI federation must be implemented and approved before any shared deployment. See [Terraform Implementation](../docs/04-terraform-implementation.md) for the staged gates.
