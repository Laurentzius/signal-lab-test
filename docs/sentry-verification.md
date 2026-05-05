# Sentry Verification

Sentry requires a real project DSN. The repository intentionally keeps `.env.example` empty so no deployment-specific secret or project identifier is committed.

## Setup

1. Create or open a Sentry project for Node/NestJS and Next.js.
2. Copy the DSN into local `.env`:

```bash
SENTRY_DSN=https://<public-key>@<org>.ingest.sentry.io/<project-id>
NEXT_PUBLIC_SENTRY_DSN=https://<public-key>@<org>.ingest.sentry.io/<project-id>
NEXT_PUBLIC_SENTRY_DASHBOARD_URL=https://<org>.sentry.io/projects/<project-slug>/?project=<project-id>
```

3. Restart the stack so both apps read the DSN:

```bash
docker compose up -d --build
```

## Backend Signal

Run the system error scenario:

```bash
node -e "fetch('http://localhost:3001/api/scenarios/run',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'system_error',name:'sentry-backend-check'})}).then(async r=>{console.log(await r.text()); console.log('HTTP '+r.status)})"
```

Expected API result: `HTTP 500` with `Unexpected system failure`.

Expected Sentry result: an event named `Simulated system error for scenario` in the project dashboard.

## Frontend Signal

Open `http://localhost:3000/sentry-example-page` and click `Send Frontend Error to Sentry`.

Expected Sentry result: an event named `Signal Lab frontend Sentry test error`.

## Notes

- If `SENTRY_DSN` is empty, backend startup prints `SENTRY_DSN not set, Sentry disabled` and all non-Sentry observability still works.
- Do not commit `.env`; `.gitignore` excludes it.
