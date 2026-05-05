---
name: after-new-endpoint
description: Verifies that a new NestJS endpoint has proper observability (metrics, logging, error handling)
trigger: after creating or modifying a controller or service file
---

# After New Endpoint Hook

## Problem

Developers often forget to add observability (metrics, logging, Sentry) when creating new endpoints, leading to blind spots in production.

## Action

After creating or modifying a controller or service file, verify:

1. **Metrics**: Check if the endpoint uses MetricsService or if MetricsInterceptor will track it automatically
2. **Logging**: Verify structured JSON logging exists in the service
3. **Error Handling**: Check for proper HTTP exceptions (not generic `throw new Error()`)
4. **Sentry**: If the endpoint can fail with system errors, verify Sentry.captureException() is called

## Check

```bash
powershell -ExecutionPolicy Bypass -File .cursor/hooks/scripts/check-endpoint-observability.ps1 <file>
```

## Output

If any check fails, report:
```
⚠️ Endpoint <name> is missing:
  - [ ] Structured logging (add structuredLogger)
  - [ ] Metrics tracking (add MetricsService or rely on interceptor)
  - [ ] Proper error handling (use HttpException subclasses)
```
