# Project Charter

## Purpose

Create a reusable reference design and staged implementation for a containerized .NET API on AWS. The project demonstrates architecture, infrastructure as code, secure delivery, operations, and recovery. It is a learning/reference platform, not a deployed product or a compliance certification.

## Workload and data boundary

The example is a stateless API with `/health`, `/api/patients`, and `/api/appointments`, using SQL Server. Use synthetic data only. Never put PHI, personal/customer data, production credentials, or real records in this repository, test fixtures, logs, screenshots, or a learning account.

## Goals

- Deploy a private application tier across at least two Availability Zones.
- Restrict database access to the application tier and keep the database private.
- Build, scan, promote, and roll back immutable container images.
- Manage identity, secrets, Terraform state, telemetry, backups, and recovery deliberately.
- Document architecture decisions, cost drivers, acceptance gates, and residual risk.

## Out of scope initially

Real regulated data, compliance certification, active-active multi-region, Kubernetes, self-managed databases, and EFS without a demonstrated POSIX shared-storage requirement. Production deployment is out of scope until accountable owners approve workload, security, privacy/compliance, operations, database, and cost requirements.

## Decisions required before production

- AWS Organization/account strategy, regions, residency, CIDRs, and network connectivity.
- Data classification, regulatory obligations, retention, audit, incident response, and access policies.
- API authentication/authorization, traffic and latency targets, peak load, and scaling needs.
- SQL Server edition/version, license, data size/growth, maintenance, and recovery requirements.
- Domain/certificate ownership, public ingress, CloudFront/cache requirements, and client access.
- Budget, cost ceiling, business owners, support coverage, and approved RTO/RPO.

## Provisional service objectives

These are not service guarantees. Owners must set measurable SLI/SLO, RTO, RPO, latency, and security acceptance targets before deployment.

| Objective | Owner decision |
|---|---|
| Availability and error budget | Define endpoint, measurement window, exclusions, and paging policy |
| Recovery time and data loss | Set RTO/RPO per failure and data class; test restore/failover |
| Performance and capacity | Define p95/p99 latency and throughput; validate with load tests |
| Security release gate | Set finding severity thresholds, exception owner, and expiry |

## Definition of done

Reviewed diagrams match the deployment; Terraform and application changes pass required checks; staging proves integration, health, scaling, and rollback; CI uses short-lived federated identity; alarms have responders/runbooks; a restore has been tested; cost is approved; security, privacy/compliance, database, and operations owners accept production readiness and residual risks.
