# CI/CD and Release Design

## Default approach

Use GitHub Actions with AWS IAM OIDC federation: it avoids long-lived AWS keys and a self-managed Jenkins control plane. Jenkins remains an option where already operated or required for the learning objective; then patch, isolate, monitor, back up, and govern its controller, agents, plugins, and credentials as production infrastructure.

## Pull request checks

Run tests, lint/format, Terraform validation and plan, secret/dependency/source/image/IaC scans, and policy checks. Do not apply infrastructure from untrusted pull requests or expose secret-bearing plan details in public artifacts.

## Release sequence

1. Protect the branch and require reviewed merge.
2. Build once; publish to ECR with immutable commit tag and record the image digest.
3. Assume an environment-scoped AWS role with OIDC claims restricted to this repository and approved branch/environment.
4. Deploy the exact digest to staging; run smoke tests, readiness checks, and migration checks.
5. Require production approval. Deploy via ECS rolling deployment with circuit breaker/rollback; use blue/green only when its risk/availability value justifies complexity.
6. Verify health, errors, latency, and agreed business checks; rollback when thresholds are breached.
7. Retain approvals, scan results, artifact digest, and deployment evidence under organization policy.

## Database migrations

Use backward-compatible expand/migrate/contract steps. Do not run destructive migrations automatically on every service start. Define migration approval, coexistence window, data restore, and rollback/forward-fix before release.

## Infrastructure workflow and security

Application release and Terraform apply are separate workflows. PRs run checks and produce a restricted reviewed plan; apply occurs after merge, fresh plan review, account checks, and production approval. Use distinct environment roles and least-privilege job permissions. Pin tool/provider/action versions per policy. Protect against fork workflows receiving deployment access. Keep secrets out of workflow output, command lines, artifacts, and image layers.

## Rollback

For stateless app failures, redeploy the prior known-good image digest and verify. For infrastructure, revert and review a new Terraform plan; automatic rollback is not assumed. For data changes, follow the tested migration-specific recovery plan. Escalate to incident response if customer impact or data loss is suspected.
