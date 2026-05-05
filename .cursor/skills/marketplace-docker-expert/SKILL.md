---
name: marketplace-docker-expert
description: Marketplace skill binding for Docker Compose and container DX in Signal Lab
source: marketplace
marketplace_slug: docker-expert
---

# Marketplace Binding: docker-expert

## When to Use

- Changing `docker-compose.yml`
- Updating Dockerfiles, volume mounts, or ports
- Debugging service startup or health issues

## Binding Instructions

Use the marketplace `docker-expert` skill for container guidance, then apply Signal Lab conventions:

- `docker compose up -d` must start the full stack.
- Backend must run Prisma generate + migrate before NestJS starts.
- Preserve hot reload mounts for frontend and backend.
- Keep `.dockerignore` small and effective.

## Signal Lab Overrides

- Do not require manual DB setup.
- Do not remove observability services from Compose.
