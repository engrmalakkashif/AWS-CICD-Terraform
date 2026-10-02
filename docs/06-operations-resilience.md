# Operations and Resilience

## Signals and response

Define service-level indicators before paging: successful user-visible requests, latency percentiles, volume, and errors. Correlate these with ALB, ECS, RDS, and deployment events. Redact credentials, tokens, request bodies, and sensitive identifiers.

| Signal | First response |
|---|---|
| ALB target health / 5xx | Check deployment, readiness, dependencies, and target registration |
| API latency/error SLI | Inspect telemetry and saturation; consider rollback or load shedding |
| ECS task count/restarts/CPU/memory | Check scaling, limits, quotas, recent release, and capacity |
| RDS availability/connections/storage/latency | Check failover, connection pool, capacity, and query health |
| Subnet/NAT/endpoint capacity | Check IP exhaustion, egress routes, and AZ-local dependencies |
| Security findings | Route by severity to named owner; track remediation or expiring exception |

Tune thresholds and paging windows against load tests and the approved SLO. Every alarm needs an owner, runbook, and escalation path.

## Operational readiness

Name primary/backup service owners and escalation contacts. Publish runbooks for deploy/rollback, unhealthy targets, elevated errors/latency, task exhaustion, database failover, secret rotation, certificate renewal, compromise, quota/subnet exhaustion, restore, and regional recovery. Include required permissions and safe commands.

## Backups and recovery

- Set RDS backup retention and point-in-time recovery to approved RPO; monitor completion and enable deletion protection.
- Govern vault access, encryption, retention, immutability/copy policy, and deletion safeguards. Keep backup administration separate from workload roles.
- Use S3 versioning/lifecycle/replication only for approved recovery needs; replication is not protection from every deletion/corruption scenario.
- Restore into an isolated environment; record restore duration, recovered point, dependencies, evidence, and follow-up owners.
- Rehearse at an approved cadence and after material changes.

Multi-AZ is the baseline for in-region resilience, not regional DR. Select backup-and-restore, pilot-light, warm standby, or active-active only after owners approve RTO/RPO, data residency, and cost. A secondary region is not DR until DNS cutover, data recovery, secrets/keys, images, quotas, operator access, and failback have been tested.

## Failure exercises

Use production-like non-production and an approved change window. Test stopping a task, unhealthy release rollback, bounded retries on dependency failure, RDS failover/reconnect, isolated backup restore, credential rotation, and AZ failure assumptions. Never run destructive chaos experiments in production without a formal game-day plan and approval. Record expected/observed results, evidence, owner, and due date.

## Incident and data lifecycle

Maintain severity, communications, privacy escalation, evidence preservation, and post-incident review. Set log/data retention and deletion with legal/compliance owners. Ensure account teardown cannot delete protected records or backups.
