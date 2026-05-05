# Signal Lab

Observability playground with AI-assisted development.

## Quick Start

### Prerequisites

- Docker & Docker Compose v2
- Node.js 20+ (for local development only)

### Start

```bash
# Clone and start everything
git clone <repo-url> signal-lab-test
cd signal-lab-test
cp .env.example .env
docker compose up -d
```

### Verify

```bash
# Automated local verification
npm run verify

# Health check
curl http://localhost:3001/api/health
# Expected: {"status":"ok","timestamp":"..."}

# Frontend
open http://localhost:3000

# API Docs
open http://localhost:3001/api/docs

# Metrics
curl http://localhost:3001/metrics

# Grafana
open http://localhost:3100
open http://localhost:3100/d/signal-lab-main/signal-lab-dashboard?orgId=1
# Frontend redirect for assignment walkthrough
open http://localhost:3000/grafana
# Login: admin/admin (or anonymous viewer)

# Prometheus
open http://localhost:9090
```

`npm run verify` runs backend tests, frontend tests, both production builds, and the executable Cursor AI-layer checks.

If `open` is unavailable on your OS, paste the URL into a browser.

### Stop

```bash
docker compose down
# Remove volumes too:
docker compose down -v
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Signal Lab UI                     │
│              (Next.js + shadcn/ui + TW)              │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Run Scenario│  │  Run History │  │  Obs Links │  │
│  │  (RHF form) │  │ (TanStack Q) │  │  Grafana…  │  │
│  └──────┬──────┘  └──────────────┘  └────────────┘  │
└─────────┼───────────────────────────────────────────┘
          │ POST /api/scenarios/run
          ▼
┌─────────────────────────────────────────────────────┐
│                   NestJS API                         │
│                                                     │
│  scenario.controller → scenario.service              │
│       │          │           │          │             │
│   Prisma/PG   Prometheus  Sentry    Structured       │
│   (persist)   (metrics)   (errors)  Logs → Loki      │
└─────────────────────────────────────────────────────┘
          │                    │
          ▼                    ▼
┌──────────────┐    ┌─────────────────────┐
│  PostgreSQL  │    │      Grafana        │
│   (Prisma)   │    │  dashboards:        │
└──────────────┘    │  metrics + logs     │
                    └─────────────────────┘
```

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, shadcn/ui, Tailwind CSS, TanStack Query, React Hook Form |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL 16, Prisma |
| Observability | Sentry, Prometheus, Grafana, Loki, Promtail |
| Infra | Docker Compose |

## Scenarios

| Type | What Happens | Signals |
|------|-------------|---------|
| `success` | Normal execution, returns 200 | log: info, metric: counter+1, histogram: latency |
| `validation_error` | Rejects invalid input, returns 400 | log: warn, metric: error counter, Sentry: breadcrumb |
| `system_error` | Unhandled exception, returns 500 | log: error, metric: error counter, Sentry: exception |
| `slow_request` | 2-5s artificial delay | log: warn (slow), metric: histogram spike |
| `teapot` | Easter egg, returns 418 | log: info, metadata: {easter: true} |

## Observability Verification

| Signal | How to Reproduce | Where to See |
|--------|-----------------|-------------|
| Prometheus metric | Run any scenario | `GET /metrics` → `scenario_runs_total` |
| Grafana dashboard | Run 3+ scenarios | `http://localhost:3100` → Signal Lab Dashboard |
| Loki log | Run scenario, check logs | Grafana → Explore → Loki → `{app="signal-lab"}` |
| Sentry exception | Run `system_error` scenario | Sentry project dashboard |
| Frontend Sentry error | Open `/sentry-example-page` and click `Send Frontend Error to Sentry` | Sentry project dashboard |

Sentry verification requires a real DSN in local `.env`; it is intentionally not committed. See `docs/sentry-verification.md` for the exact reviewer walkthrough.
Set `NEXT_PUBLIC_SENTRY_DASHBOARD_URL` locally if you want the frontend links panel to include a direct Sentry dashboard link.

## Demo Walkthrough

Use this as the reviewer script: click in the UI, then look at each observability surface.

```bash
git clone <repo-url> signal-lab-test
cd signal-lab-test
cp .env.example .env
docker compose up -d
```

1. Open `http://localhost:3000` and confirm the Signal Lab UI loads.
2. In the `Run Scenario` card, open `Scenario Type` and select `System Error`.
3. Click `Run Scenario` and expect the UI to show a failed scenario toast.
4. Open `http://localhost:3001/metrics` and confirm `scenario_runs_total{type="system_error",status="error"}` increased.
5. Open `http://localhost:3100`, go to Grafana Explore, select Loki, and query `{app="signal-lab"}`.
6. Confirm the Loki logs include `Scenario run failed` with `scenarioType="system_error"`.
7. Open `http://localhost:3000/grafana` and confirm the dashboard link/redirect works.
8. In Grafana, open `Signal Lab Dashboard` and confirm the metrics/log panels show the generated signal.
9. If real Sentry DSNs are configured in `.env`, open Sentry and confirm `Simulated system error for scenario` was captured.
10. Open `.cursor/` and confirm `rules`, `skills`, `commands`, `hooks`, `manifest.json`, and `hooks.json` are present.
11. Run `npm run check:ai-layer` and confirm the executable AI-layer checks pass.
12. In a new Cursor chat, run `/run-prd prds/002_prd-observability-demo.md` and confirm the orchestrator creates an `.execution/<timestamp>/` run with `context.json` and `REPORT.md`.

Stop the stack when finished:

```bash
docker compose down
```

## How We Verify

The submission is checked with this smoke path:

```bash
git clone <repo-url> signal-lab-test
cd signal-lab-test
cp .env.example .env
docker compose up -d
open http://localhost:3000
# In the UI: select `System Error`, then click `Run Scenario`.
open http://localhost:3001/metrics
open http://localhost:3100
open http://localhost:3000/grafana
# Open Sentry and confirm the backend exception if real DSNs are configured.
npm run check:ai-layer
```

Expected results:

- Docker starts frontend, backend, PostgreSQL, Prometheus, Grafana, Loki, and Promtail.
- `http://localhost:3000` loads the scenario runner UI.
- Running `System Error` increments the `scenario_runs_total` error metric.
- Grafana Explore shows the Loki log for the failed scenario.
- The Grafana dashboard shows the generated metric/log signal.
- Sentry captures the backend exception when real DSNs are configured.
- `.cursor/` contains rules, custom skills, marketplace bindings, commands, hooks, and executable verification scripts.
- The orchestrator skill works from a fresh Cursor chat via `/run-prd`.

## Tests

```bash
npm run test
npm run build
npm run check:ai-layer
npm run verify
```

- Backend tests exercise public NestJS HTTP endpoints for all scenario types and `/metrics`.
- Frontend tests exercise the API client and scenario form behavior.
- AI-layer verification checks required Cursor artifacts and runs the hook scripts against real project files.

## AI Layer

See `.cursor/ai-layer.md` for full documentation.

The AI layer is repository-local Cursor configuration that makes a fresh AI chat productive without manual onboarding.

What it contains:

- **Rules** define the project constraints: stack choices, observability naming, Prisma workflow, frontend patterns, and error handling.
- **Skills** provide task playbooks for observability integration, NestJS endpoint scaffolding, Prisma schema review, and PRD orchestration.
- **Commands** expose repeatable workflows such as `/add-endpoint`, `/check-obs`, `/health-check`, and `/run-prd`.
- **Hooks** provide executable reminders/checks after endpoint and schema changes.
- **Manifests** make the layer reviewable without relying on hidden Cursor state.

Why it exists:

- A reviewer can inspect `.cursor/` and see the intended AI behavior.
- A new chat can follow the same rules and workflows as previous chats.
- Observability requirements stay attached to code-generation tasks.
- The AI-layer itself can be verified with `npm run check:ai-layer`.

How to use it:

- Start a new Cursor chat in this repository.
- Ask for normal implementation work and let the rules constrain stack and code style.
- Type `/check-obs` to review metrics, logs, Sentry, and dashboard wiring.
- Type `/health-check` after `docker compose up -d` to verify local services.
- Type `/add-endpoint` when adding a NestJS endpoint with required observability.
- Type `/run-prd prds/002_prd-observability-demo.md` to run the orchestrator workflow.
- Run `npm run check:ai-layer` in the terminal to validate manifests and hook scripts.

### Quick Reference

- **Rules**: `.cursor/rules/` — 5 files covering stack, observability, Prisma, frontend, errors
- **Skills**: `.cursor/skills/` — 4 skills (observability, endpoint scaffold, prisma review, orchestrator)
- **Commands**: `.cursor/commands/` — 4 commands (`/add-endpoint`, `/check-obs`, `/health-check`, `/run-prd`)
- **Hooks**: `.cursor/hooks/` — 2 hooks (after new endpoint, after schema change)
- **Marketplace**: `.cursor/marketplace-skills.md` — 7 connected skills with rationale
- **Marketplace bindings**: `.cursor/skills/marketplace-*/SKILL.md` — 7 binding adapters with `source: marketplace`
- **Executable verification**: `npm run check:ai-layer` — validates manifests and hook scripts

### Running the Orchestrator

```
/run-prd prds/002_prd-observability-demo.md
```

This will:
1. Analyze the PRD
2. Scan the codebase
3. Create an implementation plan
4. Break into atomic tasks
5. Execute via subagents
6. Review quality
7. Generate a report

An example completed execution is committed at:

```bash
.execution/2026-05-05-assignment-check/context.json
.execution/2026-05-05-assignment-check/REPORT.md
```

Machine-readable AI layer manifests are available at:

```bash
.cursor/manifest.json
.cursor/hooks.json
.cursor/marketplace-skills.json
.cursor/skills/marketplace-*/SKILL.md
```

## Project Structure

```
signal-lab-test/
├── apps/
│   ├── frontend/          # Next.js App Router
│   │   └── src/
│   │       ├── app/       # Pages
│   │       ├── components/# UI components
│   │       ├── hooks/     # Custom hooks
│   │       └── lib/       # Utilities
│   └── backend/           # NestJS
│       └── src/
│           ├── health/    # Health endpoint
│           ├── scenarios/ # Scenario execution
│           ├── metrics/   # Prometheus metrics
│           ├── prisma/    # Database service
│           └── common/    # Filters, logger, sentry
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # SQL migrations
├── grafana/
│   ├── provisioning/      # Datasources & dashboards config
│   └── dashboards/        # Dashboard JSON files
├── prometheus/            # Prometheus config
├── promtail/              # Promtail config
├── .cursor/               # AI layer (rules, skills, commands, hooks)
├── docker-compose.yml
├── .env.example
└── README.md
```
