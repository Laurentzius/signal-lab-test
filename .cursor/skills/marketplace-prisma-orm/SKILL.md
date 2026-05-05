---
name: marketplace-prisma-orm
description: Marketplace skill binding for Prisma ORM usage in Signal Lab
source: marketplace
marketplace_slug: prisma-orm
---

# Marketplace Binding: prisma-orm

## When to Use

- Editing `prisma/schema.prisma`
- Creating or reviewing migrations
- Adding database queries in NestJS services

## Binding Instructions

Use the marketplace `prisma-orm` skill for general Prisma guidance, then apply Signal Lab conventions:

- Schema lives at `prisma/schema.prisma`.
- Use `cuid()` string IDs and `createdAt DateTime @default(now())`.
- Include `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` for Docker Alpine.
- Run generate/migrate with `--schema=./prisma/schema.prisma`.

## Signal Lab Overrides

- Do not use raw SQL.
- Do not add another ORM.
