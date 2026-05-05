---
name: marketplace-postgresql-table-design
description: Marketplace skill binding for PostgreSQL table design in Signal Lab
source: marketplace
marketplace_slug: postgresql-table-design
---

# Marketplace Binding: postgresql-table-design

## When to Use

- Designing or changing PostgreSQL-backed Prisma models
- Reviewing table shape, field types, timestamps, and JSON metadata
- Adding indexes or relations

## Binding Instructions

Use the marketplace `postgresql-table-design` skill for data modeling guidance, then apply Signal Lab conventions:

- `ScenarioRun` is the central domain table.
- `metadata Json?` is used for scenario-specific context such as `{ "easter": true }`.
- Keep fields simple and readable for interview verification.

## Signal Lab Overrides

- Do not prematurely split the domain into many tables.
- Do not use raw SQL migrations unless Prisma generates them.
