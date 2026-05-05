# Observability Conventions

## Metrics Naming

All metrics must follow Prometheus naming conventions:

```
scenario_runs_total          # Counter: total scenario runs
scenario_run_duration_seconds # Histogram: run duration
http_requests_total          # Counter: all HTTP requests
```

### Labels

- `type`: scenario type (`success`, `validation_error`, `system_error`, `slow_request`, `teapot`)
- `status`: outcome (`success`, `error`)
- `method`: HTTP method (GET, POST)
- `path`: request path
- `status_code`: HTTP status code as string

### Rules

- Counters end with `_total`
- Histograms end with `_seconds`
- Use snake_case for metric names
- Keep label cardinality low (< 10 values per label)

## Structured Logging

All logs must be JSON format with these fields:

```json
{
  "timestamp": "ISO 8601",
  "level": "log|warn|error",
  "message": "descriptive message",
  "context": "ClassName",
  "scenarioType": "success",
  "scenarioId": "cuid",
  "duration": 1234,
  "error": "error message if applicable"
}
```

### Rules

- Use the project `structuredLogger` from `apps/backend/src/common/logger/structured-logger.ts`
- Always include `scenarioType` and `scenarioId` in scenario-related logs
- Use `log` for normal operations, `warn` for slow requests, `error` for failures
- Never log sensitive data (passwords, tokens, PII)

## Sentry Integration

### When to Capture

- **Always**: `system_error` scenarios (unhandled exceptions)
- **Optional**: `validation_error` as breadcrumbs
- **Never**: `success` or `slow_request` (no errors)

### How to Capture

```typescript
import * as Sentry from "@sentry/nestjs";
Sentry.captureException(error);
```

### DSN Configuration

- Use `SENTRY_DSN` environment variable
- Never hardcode DSN in source code
