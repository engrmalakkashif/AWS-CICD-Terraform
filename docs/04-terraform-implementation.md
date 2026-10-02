# Terraform Implementation Guide

## Target layout

```text
.
├── README.md
├── docs/
├── application/{src,tests}/
├── infrastructure/
│   ├── bootstrap/              # state and CI federation; separately controlled
│   ├── modules/                # extract after first working slice
│   └── live/{dev,staging,prod}/ # root modules and per-env backend config
└── .github/workflows/
```

Each environment is an explicit root module and state key. Do not share a state file across environments. Keep modules small, versioned, tested, and meaningful; avoid a module for every individual resource.

## Guardrails

- Pin Terraform/provider versions and commit `.terraform.lock.hcl`.
- Use an encrypted, versioned S3 backend with restricted/audited access and native S3 lockfile support (`use_lockfile = true`) when supported by the pinned Terraform version.
- Bootstrap state and CI identity separately; the workload stack must not create its own backend.
- Never commit state, saved plans, credentials, or secret values. Restrict plan artifacts and logs.
- CI runs format, validate, lint/security/policy checks, and a reviewed plan. Never auto-apply an untrusted PR. Protect production apply with short-lived OIDC credentials and approval.
- Tag billable resources with owner, app, environment, cost center, data classification, and managed-by.
- Plan stateful-resource replacement/deletion carefully; enable deletion protection and document approved removal.
- Avoid provisioners and ad-hoc remote execution where managed APIs can express the resource.

## Step-by-step implementation and gates

### 0. Discovery
Approve account/environment strategy, region, CIDR, domain, data classification, budget, owners, SQL Server requirements, and recovery objectives.

**Gate:** isolated account/role verified, root credentials are not used for automation, budgets are active, design assumptions are recorded.

### 1. State and CI identity
Create remote state and OIDC roles using controlled bootstrap. Configure separate dev/staging/prod state and permissions.

**Gate:** lock/concurrency test succeeds; encryption/versioning/audit/access are verified; CI receives only short-lived scoped credentials.

### 2. Network
Create VPC, multi-AZ public/application/database subnet tiers, route tables, Internet Gateway, approved NAT/endpoints, flow logs, and security groups.

**Gate:** CIDRs do not overlap; no public database/application route exists; egress paths and security flows are verified.

### 3. Registry and workload identity
Create ECR with immutable tags, scanning, encryption, lifecycle policy, and separate task/execution roles. Build a minimal API image.

**Gate:** image is tested, reproducible, secret-free, and meets vulnerability policy; only authorized roles can pull it.

### 4. Ingress and service
Create ALB/listeners/certificate, WAF, ECS cluster/service/task definition, private subnet placement, readiness checks, and bounded scaling.

**Gate:** TLS and origin behavior are verified; tasks have no public IP; health checks and single-task/AZ failure behavior are tested.

### 5. Database and integration
Provision approved private RDS SQL Server edition/size with encryption, backups, deletion protection, and monitoring. Fetch credentials at runtime. Apply schema changes as a controlled release step.

**Gate:** only the app path connects; secret retrieval/rotation is verified; isolated restore succeeds; migration recovery is documented.

### 6. Delivery and telemetry
Add CI tests/scans, digest-based artifact promotion, staging smoke tests, production approval, dashboards, alarms, logs, and runbooks.

**Gate:** unhealthy deployment blocks promotion or rolls back; alarms reach named responders; deployment and rollback are rehearsed.

### 7. Resilience and production review
Load-test, review quotas and costs, test failure/recovery, complete security/privacy/compliance review, and obtain owner approval.

**Gate:** restore achieves approved RTO/RPO; residual risks are accepted and assigned; no release-blocking security finding remains.

## Validation commands

From the relevant Terraform root after implementation:

```bash
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
```

For a real plan, use the bootstrapped environment backend and approved AWS identity:

```bash
terraform init -reconfigure
terraform plan -out=tfplan
```

Review plans before apply; keep saved plans out of Git and unrestricted logs/artifacts. Destroy only disposable environments after verifying account/region and retention requirements.
