# Verification Evidence

Last local verification: 2026-05-05.

## Automated Commands

```bash
npm run verify
```

This command runs:

- `npm run test:backend`
- `npm run test:frontend`
- `npm run build:backend`
- `npm run build:frontend`
- `npm run check:ai-layer`

## Runtime Walkthrough

Verified runtime endpoints:

- `GET http://localhost:3001/api/health` returns `200` with `{ "status": "ok" }`.
- `GET http://localhost:3000` returns `200`.
- `GET http://localhost:3001/api/docs` returns `200`.
- `GET http://localhost:3100/api/health` returns `200`.
- `GET http://localhost:9090/-/healthy` returns `200`.
- `GET http://localhost:3101/ready` returns `200`.

Verified scenario responses:

- `success` returns `201`.
- `validation_error` returns `400`.
- `system_error` returns `500`.
- `slow_request` returns `201` after an artificial delay.
- `teapot` returns `418` with `signal: 42`.

Verified observability:

- `/metrics` includes `scenario_runs_total`, `scenario_run_duration_seconds`, and `http_requests_total`.
- Prometheus query `sum(scenario_runs_total)` returns scenario data.
- Grafana dashboard UID `signal-lab-main` is provisioned.
- Loki range query `{app="signal-lab"} |= "scenarioType"` returns structured scenario logs.

Sentry evidence requires local DSN setup; see `docs/sentry-verification.md`.
