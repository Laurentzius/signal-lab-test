---
name: observability-integration
description: Add Prometheus metrics, structured logging, and Sentry integration to a NestJS endpoint or service
---

# Observability Integration Skill

## When to Use

- Adding a new NestJS endpoint that needs metrics
- Adding logging to an existing service
- Integrating Sentry error capture for a new feature
- Reviewing observability coverage of a module

## Instructions

### 1. Add Prometheus Metrics

If the new code needs custom metrics:

```typescript
// In metrics.service.ts, add a new metric:
myNewCounter = new Counter({
  name: "my_feature_total",
  help: "Total my feature operations",
  labelNames: ["type", "status"],
  registers: [this.registry],
});

// In your service, increment:
this.metrics.myNewCounter.inc({ type: "someType", status: "success" });
```

Standard metrics already exist:
- `scenario_runs_total` — incremented for every scenario run
- `scenario_run_duration_seconds` — tracks execution time
- `http_requests_total` — auto-tracked by MetricsInterceptor

### 2. Add Structured Logging

Use the project `structuredLogger` so Loki receives consistent JSON fields:

```typescript
import { structuredLogger } from "../common/logger/structured-logger";

structuredLogger.info({
  message: "Action description",
  context: MyService.name,
  scenarioType: dto.type,
  scenarioId: result.id,
  duration: Date.now() - start,
});
```

### 3. Add Sentry Capture

For error scenarios that should be tracked in Sentry:

```typescript
import * as Sentry from "@sentry/nestjs";

// In catch block:
Sentry.captureException(error);
```

### 4. Verification Checklist

After integration, verify:
- [ ] `GET /metrics` shows the new metric
- [ ] Logs appear in JSON format in Docker logs
- [ ] Errors are captured in Sentry (if DSN configured)
- [ ] Metric labels match `observability-conventions.md`
