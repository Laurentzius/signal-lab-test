# Signal Lab — Submission Checklist

---

## Repository

- **URL**: `<your-repo-url>`
- **Before final submission**: replace this placeholder with your review repository URL.
- **Branch**: `main`
- **Time worked**: ~8 hours

---

## Start

```bash
# Start command:
docker compose up -d

# Verification:
npm run verify
curl http://localhost:3001/api/health
open http://localhost:3000

# Stop:
docker compose down
```

**Prerequisites**: Docker 24+, Docker Compose v2, Node.js 20+ (local dev only)

---

## Stack Confirmation

| Technology | Used | Where to Look |
|-----------|:----:|---------------|
| Next.js (App Router) | ✓ | `apps/frontend/src/app/` |
| shadcn/ui | ✓ | `apps/frontend/src/components/ui/` |
| Tailwind CSS | ✓ | `apps/frontend/tailwind.config.ts` |
| TanStack Query | ✓ | `apps/frontend/src/components/run-history.tsx` |
| React Hook Form | ✓ | `apps/frontend/src/components/scenario-form.tsx` |
| NestJS | ✓ | `apps/backend/src/` |
| PostgreSQL | ✓ | `docker-compose.yml` postgres service |
| Prisma | ✓ | `prisma/schema.prisma` |
| Sentry | ✓ | `apps/backend/src/common/sentry.ts` |
| Prometheus | ✓ | `apps/backend/src/metrics/`, `prometheus/prometheus.yml` |
| Grafana | ✓ | `grafana/` provisioning + dashboards |
| Loki | ✓ | `docker-compose.yml` loki + promtail services |

---

## Observability Verification

| Signal | How to Reproduce | Where to See |
|--------|-----------------|-------------|
| Prometheus metric | Run any scenario from UI | `http://localhost:3001/metrics` → `scenario_runs_total` |
| Grafana dashboard | Run 3+ different scenarios | `http://localhost:3100/d/signal-lab-main/signal-lab-dashboard?orgId=1` or `http://localhost:3000/grafana` → Signal Lab Dashboard |
| Loki log | Run scenario, wait 10s | Grafana → Explore → Loki → `{app="signal-lab"}` |
| Sentry exception | Run "System Error" scenario | Sentry project dashboard (set SENTRY_DSN in .env) |
| Frontend Sentry error | Open `http://localhost:3000/sentry-example-page`, click trigger | Sentry project dashboard |

---

## Cursor AI Layer

### Custom Skills

| # | Skill Name | Purpose |
|---|-----------|---------|
| 1 | `observability-integration` | Add metrics, logs, Sentry to endpoints |
| 2 | `nestjs-endpoint-scaffold` | Scaffold new NestJS endpoint with observability |
| 3 | `prisma-schema-review` | Review Prisma changes, migration workflow |
| 4 | `signal-lab-orchestrator` | Execute PRDs through 7-phase pipeline |

### Commands

| # | Command | What It Does |
|---|---------|-------------|
| 1 | `/add-endpoint` | Scaffold new NestJS endpoint |
| 2 | `/check-obs` | Verify observability setup |
| 3 | `/health-check` | Check Docker stack health |
| 4 | `/run-prd` | Execute PRD via orchestrator |

### Hooks

| # | Hook | Problem Solved |
|---|------|---------------|
| 1 | `after-new-endpoint` | Ensures observability on new endpoints |
| 2 | `after-schema-change` | Reminds to run migration after schema edits |

### Rules

| # | Rule File | What It Fixes |
|---|----------|---------------|
| 1 | `stack-constraints.md` | Prevents forbidden libraries (Redux, CSS modules, etc.) |
| 2 | `observability-conventions.md` | Metric naming, log format, Sentry usage |
| 3 | `prisma-patterns.md` | No raw SQL, proper migration workflow |
| 4 | `frontend-patterns.md` | TanStack Query, RHF, shadcn patterns |
| 5 | `error-handling.md` | Proper HTTP exceptions, user-facing errors |

### Marketplace Skills

| # | Skill | Why Connected |
|---|-------|--------------|
| 1 | `next-best-practices` | App Router patterns |
| 2 | `shadcn-ui` | Component usage |
| 3 | `tailwind-design-system` | Consistent styling |
| 4 | `nestjs-best-practices` | Module structure |
| 5 | `prisma-orm` | Schema & client patterns |
| 6 | `docker-expert` | Container best practices |
| 7 | `postgresql-table-design` | DB indexing & types |

**Custom skills cover**: Signal Lab-specific Prometheus/Loki/Sentry patterns not in marketplace skills.

**Marketplace binding files**: `.cursor/skills/marketplace-*/SKILL.md`, each with `source: marketplace` and `marketplace_slug` frontmatter.

---

## Orchestrator

- **Path**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Context file**: `.execution/2026-05-05-assignment-check/context.json`
- **Phases**: 7 (analysis, codebase, planning, decomposition, implementation, review, report)
- **Fast model tasks**: Simple code generation (add field, create DTO, add metric)
- **Default model tasks**: Architecture decisions, complex logic
- **Resume support**: Yes (reads context.json, skips completed phases)
- **Example report**: `.execution/2026-05-05-assignment-check/REPORT.md`

---

## Screenshots / Videos

Automated evidence is in `docs/verification-evidence.md` and can be regenerated with `npm run verify`. Screenshots/videos are optional final-review attachments:

- [ ] UI application (`http://localhost:3000`)
- [ ] Grafana dashboard with data (`http://localhost:3100`)
- [ ] Loki logs (Grafana → Explore → Loki)
- [ ] Sentry error (Sentry dashboard, requires local `SENTRY_DSN`)

## Automated Review Evidence

- [x] Backend tests: `npm run test:backend`
- [x] Frontend tests: `npm run test:frontend`
- [x] Production builds: `npm run build`
- [x] AI layer executable check: `npm run check:ai-layer`
- [x] Full verification command: `npm run verify`

---

## What I Didn't Finish (if applicable)

N/A — all requirements implemented.

---

## Defense Prep

1. **Why this decomposition of skills?** Each skill has a single responsibility. Observability skill covers the metrics/logs/Sentry triangle. Endpoint scaffold covers the NestJS boilerplate. Prisma review covers schema changes. Orchestrator ties them all together.

2. **Which tasks suit a small model?** Repetitive, well-scoped tasks: adding a field, creating a DTO, adding a metric counter. These don't need architectural judgment.

3. **Which marketplace skills connected, which replaced by custom?** Marketplace covers general best practices. Custom skills cover Signal Lab's specific patterns (Prometheus metric names, Prisma conventions, orchestrator pipeline).

4. **Which hooks reduce real errors?** After-new-endpoint prevents forgetting observability. After-schema-change prevents running with stale types.

5. **How does orchestrator save context?** Main chat only coordinates (~15k tokens). Each subagent gets fresh context with only relevant files. 80%+ of work uses fast models in isolated sessions.
