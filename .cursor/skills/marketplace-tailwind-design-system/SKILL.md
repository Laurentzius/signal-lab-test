---
name: marketplace-tailwind-design-system
description: Marketplace skill binding for Tailwind design system usage in Signal Lab
source: marketplace
marketplace_slug: tailwind-design-system
---

# Marketplace Binding: tailwind-design-system

## When to Use

- Changing layout, spacing, color, responsiveness, or typography
- Updating `tailwind.config.ts` or `globals.css`
- Reviewing UI consistency

## Binding Instructions

Use the marketplace `tailwind-design-system` skill for Tailwind patterns, then apply Signal Lab conventions:

- Preserve shadcn CSS variables (`--background`, `--border`, `--primary`, etc.).
- Keep layouts responsive with Tailwind utility classes.
- Avoid custom CSS except global theme variables.

## Signal Lab Overrides

- Do not remove shadcn color tokens.
- Do not add CSS modules or styled-components.
