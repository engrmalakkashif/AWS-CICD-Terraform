# Network and Security Design

## Network tiers

Use an approved, non-overlapping VPC CIDR. The values below are examples only; verify against VPN, on-premises, and organization networks. Deploy across at least two Availability Zones and size subnets for task ENIs, endpoints, and scaling headroom.

| Tier | Example AZ-A / AZ-B subnet | Purpose |
|---|---|---|
| Public ingress | `10.0.1.0/24`, `10.0.2.0/24` | Internet-facing ALB; NAT if selected |
| Application | `10.0.11.0/24`, `10.0.12.0/24` | ECS tasks or private EC2 instances |
| Database | `10.0.21.0/24`, `10.0.22.0/24` | RDS subnet group; no internet route |

Use distinct route tables by tier/AZ where required by the chosen egress design. Only internet-facing ingress belongs in public subnets.

## Routing and egress

- Public route tables use an Internet Gateway. Do not place application or database workloads on public IPs.
- Private application subnets use one NAT Gateway per AZ for AZ-local resilient egress, or an explicitly approved lower-cost design with the cross-AZ failure/cost tradeoff documented.
- Add VPC endpoints when justified (for example S3 gateway and interface endpoints for ECR, CloudWatch Logs, Secrets Manager, and Systems Manager). Endpoints are not authorization controls.
- Database subnets have no Internet Gateway or NAT default route.
- NAT does not filter egress. Apply workload egress policy and monitor destinations where feasible.

## Security-group policy

| Group | Inbound | Source |
|---|---|---|
| ALB | HTTPS 443; HTTP 80 only to redirect to HTTPS | Approved client ranges or public clients as required |
| Application | Target port (example 8080) | ALB security group only |
| Database | SQL Server 1433 if SQL Server is chosen | Application security group only |
| VPC endpoints | TLS 443 | Required workload security groups |

Never expose SSH/RDP, application target ports, or SQL Server to `0.0.0.0/0`. Prefer Systems Manager Session Manager for approved access. Document network ACLs only when there is a specific additional requirement.

## Identity and secrets

- Use task, EC2, and CI IAM roles; avoid long-lived access keys.
- Constrain GitHub OIDC trust by repository, branch/environment, and audience. Separate plan/apply permissions; protect production approval.
- Separate task execution permissions from application permissions. Scope roles to required actions and resource ARNs.
- Store credentials in Secrets Manager, grant runtime access to the task role, and never expose values in Git, images, Terraform variables/outputs, user data, CI logs, or plans.
- Terraform state may contain secrets even when values are marked sensitive. Encrypt it, restrict and audit access, enable versioning, and keep it separate by environment.

## Data protection and detection

Require TLS and encryption at rest for RDS, S3, EBS, logs, and state. Define KMS key ownership, rotation, recovery, and cross-account access. S3 should block public access, require TLS, use least-privilege policies, and have approved lifecycle/retention. RDS needs backups, point-in-time recovery, deletion protection, and restore tests. Redact logs and set retention.

Enable organization-approved CloudTrail, Config, GuardDuty, Security Hub, and centralized log retention where applicable. Name triage owners, remediation SLAs, and exception expiry; detection without response ownership is incomplete.

## Threat-model checklist

Review public-origin bypass/TLS downgrade; over-broad ingress or egress; compromised source control, CI, image, task role, or operator; secret leakage through state/logs/images; API authorization, injection, abuse, and denial of service; data loss or compromised backups; AZ/region outage, quota/subnet exhaustion; and sensitive data retained or used outside approved environments.
