# /check-obs

Verify observability is properly configured for the project.

## Prompt

```
Check observability setup for Signal Lab:

1. Prometheus Metrics:
   - Verify GET /metrics endpoint exists and returns Prometheus format
   - Check that scenario_runs_total, scenario_run_duration_seconds, http_requests_total metrics are defined
   - Verify MetricsInterceptor is registered globally

2. Structured Logging:
   - Check that structuredLogger outputs JSON format
   - Verify scenario-related logs include scenarioType, scenarioId, duration
   - Check that logs go to stdout (for Loki via Docker log driver)

3. Sentry Integration:
   - Verify @sentry/nestjs is initialized in main.ts
   - Check that SENTRY_DSN is read from environment
   - Verify system_error scenarios call Sentry.captureException()

4. Grafana Dashboard:
   - Check grafana/dashboards/signal-lab.json exists
   - Verify it has panels for: scenario runs, latency, error rate
   - Check datasource configuration in grafana/provisioning/

5. Docker Compose:
   - Verify prometheus, grafana, loki, promtail services are defined
   - Check volume mounts and port mappings

Report any gaps or issues found.
```
