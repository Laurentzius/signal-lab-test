---
name: marketplace-shadcn-ui
description: Marketplace skill binding for shadcn/ui component usage in Signal Lab
source: marketplace
marketplace_slug: shadcn-ui
---

# Marketplace Binding: shadcn-ui

## When to Use

- Building or modifying UI components
- Adding form controls, cards, badges, buttons, labels, or toasts
- Reviewing component accessibility and variants

## Binding Instructions

Use the marketplace `shadcn-ui` skill for component patterns, then apply Signal Lab conventions:

- Import primitives from `@/components/ui/*`.
- Use `Button`, `Card`, `Input`, `Label`, `Select`, `Badge` before custom markup.
- Use `cn()` from `@/lib/utils` for class composition.

## Signal Lab Overrides

- Do not introduce a second component library.
- Do not edit UI component APIs without updating consumers.
