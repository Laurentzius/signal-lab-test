---
name: marketplace-nestjs-best-practices
description: Marketplace skill binding for NestJS backend patterns in Signal Lab
source: marketplace
marketplace_slug: nestjs-best-practices
---

# Marketplace Binding: nestjs-best-practices

## When to Use

- Adding backend modules, controllers, services, DTOs, or filters
- Reviewing dependency injection or exception handling
- Updating Swagger or validation behavior

## Binding Instructions

Use the marketplace `nestjs-best-practices` skill for NestJS structure, then apply Signal Lab conventions:

- Keep modules under `apps/backend/src/<domain>/`.
- Use DTOs with `class-validator` and Swagger decorators.
- Use NestJS HTTP exceptions, not raw `Error`, for API failures.
- Keep `/metrics` outside the `/api` prefix.

## Signal Lab Overrides

- Do not introduce Express-only architecture outside NestJS.
- Do not bypass the global exception filter.
