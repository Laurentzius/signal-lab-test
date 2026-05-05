---
name: marketplace-next-best-practices
description: Marketplace skill binding for Next.js App Router best practices in Signal Lab
source: marketplace
marketplace_slug: next-best-practices
---

# Marketplace Binding: next-best-practices

## When to Use

- Modifying `apps/frontend/src/app/**`
- Adding a new Next.js route
- Changing client/server component boundaries
- Updating Next.js config or environment variables

## Binding Instructions

Use the marketplace `next-best-practices` skill for general Next.js guidance, then apply Signal Lab rules:

- Use App Router only.
- Keep interactive UI in explicit `"use client"` components.
- Use TanStack Query for server state.
- Preserve `/grafana` redirect and `/sentry-example-page` verification route.

## Signal Lab Overrides

- Do not add Pages Router.
- Do not replace TanStack Query with SWR.
- Do not remove Docker-friendly env variable defaults.
