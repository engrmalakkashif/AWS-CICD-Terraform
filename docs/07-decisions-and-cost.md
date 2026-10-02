# Architecture Decisions and Cost

## Decision register

| ID | Decision | Rationale / revisit trigger |
|---|---|---|
| ADR-001 | ECS Fargate is the production default; EC2 Auto Scaling is a learning/exception path | Less host operations. Revisit for host-specific needs or measured sustained cost advantage. |
| ADR-002 | RDS for SQL Server remains the sample database | Preserves the source workload; confirm edition, version, licensing, region support, and cost before provisioning. |
| ADR-003 | ALB with WAF is baseline; CloudFront is optional | Avoid unnecessary edge/cache complexity. Add for measured edge delivery/security needs and prevent/test origin bypass. |
| ADR-004 | S3 for objects; no default EFS | EFS only for validated shared POSIX semantics. EBS is block storage, S3 object storage. |
| ADR-005 | GitHub Actions OIDC is default; Jenkins is optional | Avoid self-managed CI control plane and static cloud keys. Revisit for enterprise tooling requirements. |
| ADR-006 | One NAT Gateway per AZ when resilient internet egress is required | AZ-local dependency at additional hourly/data cost; evaluate endpoints and measured egress. |
| ADR-007 | Multi-AZ baseline; no default multi-region active-active | Regional recovery requires separate business objectives, data design, testing, and funding. |

## Cost drivers

No dollar estimate is valid until region, engine/edition, traffic, retention, and purchase model are known. Estimate each environment with AWS Pricing Calculator, then compare actual spend.

| Area | Main drivers | Controls |
|---|---|---|
| RDS SQL Server | Instance/edition/license, Multi-AZ, storage, I/O, backups | Confirm licensing, size from tests, monitor spend |
| NAT Gateway | Hourly and processed-data charges, cross-AZ traffic | AZ-local routes, justified endpoints, measure egress |
| ECS/EC2 | vCPU/memory-hours or instance-hours, scale headroom | Right-size, bound autoscaling, schedule disposable non-prod |
| ALB/WAF/CloudFront | Hours, capacity units, rules, requests, transfer | Avoid duplicate layers without requirement; review traffic/rules |
| Logs/security | Ingest, retention, metrics, findings | Retention/filter policy; avoid noisy/high-cardinality telemetry |
| Storage/backups/transfer | Capacity, requests, replication, retrieval, cross-region | Lifecycle and retention aligned to approved data policy |

## Controls and risks

Use an isolated sandbox, account/workload budgets, billing alerts, ownership tags, scaling ceilings, and teardown checklist. Do not assume free tier or automatic cleanup. Review NAT, SQL licensing, log retention, backups, and cross-AZ/region transfer before apply.

| Risk | Required evidence |
|---|---|
| Healthcare framing mistaken for compliance | Synthetic data only; qualified privacy/compliance review before real data |
| SQL Server license/compatibility mismatch | Database/procurement approval of edition, version, region, and license |
| API authentication/authorization unspecified | Define identity, authorization, rate limiting, and abuse controls before launch |
| Regional recovery undefined | Approved RTO/RPO and tested funded recovery design |
| CI/state compromise | Isolated state, restricted OIDC, approvals, audit, least-privilege |
| Cost overrun | Calculator estimate, budgets, alerts, scaling limits, teardown plan |
