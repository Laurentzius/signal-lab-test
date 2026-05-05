# /health-check

Check the health of the Docker stack and application.

## Prompt

```
Run health checks on the Signal Lab stack:

1. Check if Docker containers are running:
   ```bash
   docker compose ps
   ```

2. Check backend health:
   ```bash
   curl -s http://localhost:3001/api/health
   ```
   Expected: { "status": "ok", "timestamp": "..." }

3. Check frontend:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
   ```
   Expected: 200

4. Check metrics endpoint:
   ```bash
   curl -s http://localhost:3001/metrics | head -20
   ```
   Expected: Prometheus format metrics

5. Check Grafana:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/api/health
   ```
   Expected: 200

6. Check Prometheus:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/-/healthy
   ```
   Expected: 200

7. Check Loki:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3101/ready
   ```
   Expected: 200

Report status of each component.
```
