# Implementation Checklist

A phase is complete only when its acceptance gate is met and evidence is linked from the change record.

## 0. Discovery and approval

- [ ] Assign product, platform, security, privacy/compliance, database, operations, and cost owners.
- [ ] Approve accounts, regions, CIDRs, domains, data class, budget, and environment strategy.
- [ ] Confirm API authn/authz, SQL Server edition/version/license, sizing, and workload profile.
- [ ] Approve availability/latency objectives, RTO/RPO, escalation, and recovery scope.
- [ ] Threat-model public ingress, CI identity, workload permissions, data, and backups.

**Gate:** reviewed design, cost estimate, threat model, and assumptions approved.

## 1. Repository and foundation

- [ ] Add API skeleton, tests, Dockerfile, and health/readiness endpoints.
- [ ] Pin Terraform/provider/action versions; add test, lint, format, and security checks.
- [ ] Bootstrap remote state and OIDC roles under controlled identities.
- [ ] Separate environment state/permissions; add tags and budget alerts.

**Gate:** no static CI keys; state lock/encryption/versioning/audit verified.

## 2. Network and ingress

- [ ] Build VPC, multi-AZ subnet tiers, routes, egress, endpoints, and flow logs.
- [ ] Add ALB, TLS listener, security groups, and WAF association.
- [ ] Decide CloudFront requirement and verify origin restriction if enabled.

**Gate:** diagram matches deployed plan; app/database are not publicly reachable.

## 3. Workload and data

- [ ] Create ECR policies and task/execution IAM roles.
- [ ] Deploy private multi-AZ ECS service with health checks, limits, and bounded scaling.
- [ ] Provision approved private RDS with encryption, backups, monitoring, and deletion protection.
- [ ] Inject secrets at runtime; add S3 only for approved object-storage needs.

**Gate:** least-privilege app-to-database path, synthetic integration test, and isolated restore succeed.

## 4. Release and operations

- [ ] Build/scan once, publish immutable digest, deploy to staging, smoke test, gate production approval.
- [ ] Rehearse rollback and database migration recovery.
- [ ] Add dashboards, actionable alarms, log retention, audit/security triage, and runbooks.

**Gate:** release and rollback exercise passes; alarms reach named owners.

## 5. Resilience and launch

- [ ] Complete load, scaling, failure, security, and quota tests.
- [ ] Restore backup and record achieved RTO/RPO.
- [ ] Approve regional recovery decision and test if required.
- [ ] Review forecast/actual cost and production capacity.
- [ ] Obtain security, privacy/compliance, operations, database, and product approval.

**Gate:** residual risks accepted and assigned; production readiness review signed.

## Disposable environment teardown

Verify account/region, retained data, active traffic, and destroy plan. Preserve required backups/evidence, remove only approved disposable resources, and confirm billing/security findings afterward. Never use teardown as a shortcut to delete retention-protected data.
