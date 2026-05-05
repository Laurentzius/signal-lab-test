# Cursor AI Layer Documentation

## Overview

This document describes the AI layer configured for Signal Lab. It enables Cursor to work autonomously in this repository without manual context for each new chat.

## Rules (`.cursor/rules/`)

| File | Scope | What It Prevents |
|------|-------|-----------------|
| `stack-constraints.md` | Technology choices | Using Redux, CSS modules, raw SQL, TypeORM |
| `observability-conventions.md` | Metrics, logging, Sentry | Inconsistent metric names, unstructured logs |
| `prisma-patterns.md` | Database layer | Raw SQL, wrong migration workflow |
| `frontend-patterns.md` | React/Next.js code | Wrong data fetching, custom UI components |
| `error-handling.md` | Error patterns | Silent failures, exposing internals |

## Custom Skills (`.cursor/skills/`)

| Skill | When to Use | What It Does |
|-------|------------|-------------|
| `observability-integration` | Adding metrics/logs/Sentry to code | Step-by-step guide for Prometheus, structured logging, Sentry capture |
| `nestjs-endpoint-scaffold` | Creating new API endpoint | Full boilerplate: module, controller, service, DTO with observability |
| `prisma-schema-review` | Modifying database schema | Schema checklist, migration workflow, anti-patterns |
| `signal-lab-orchestrator` | Running PRDs through multi-agent workflow | Context file, phases, model selection, retry/resume |

## Commands (`.cursor/commands/`)

| Command | What It Does |
|---------|-------------|
| `/add-endpoint` | Scaffolds a new NestJS endpoint with full observability |
| `/check-obs` | Verifies observability configuration (metrics, logs, Sentry, Grafana) |
| `/health-check` | Checks Docker stack and application health |
| `/run-prd` | Executes a PRD through the orchestrator pipeline |

## Hooks (`.cursor/hooks/`)

| Hook | Trigger | Problem Solved |
|------|---------|---------------|
| `after-new-endpoint` | After creating/modifying controller/service | Ensures observability is added to new endpoints |
| `after-schema-change` | After modifying schema.prisma | Reminds to run migration and regenerate client |

## How to Use

1. **New chat in Cursor**: The rules are automatically loaded. The agent "knows" the stack.
2. **Run a command**: Type `/add-endpoint` or `/check-obs` in the chat.
3. **Skills activate**: When the task matches a skill's "When to Use", it's automatically applied.
4. **Hooks run**: Cursor can invoke hook scripts from `.cursor/hooks.json`; reviewers can run `npm run check:ai-layer` to verify the executable layer without hidden Cursor state.

## Marketplace Skills

Marketplace skills are connected in three layers so a reviewer can verify them without relying on hidden Cursor state:

- Human-readable rationale: `.cursor/marketplace-skills.md`
- Machine-readable list: `.cursor/marketplace-skills.json`
- Skill bindings with `source: marketplace` frontmatter: `.cursor/skills/marketplace-*/SKILL.md`

Connected bindings:

| Marketplace Skill | Binding |
|-------------------|---------|
| `next-best-practices` | `.cursor/skills/marketplace-next-best-practices/SKILL.md` |
| `shadcn-ui` | `.cursor/skills/marketplace-shadcn-ui/SKILL.md` |
| `tailwind-design-system` | `.cursor/skills/marketplace-tailwind-design-system/SKILL.md` |
| `nestjs-best-practices` | `.cursor/skills/marketplace-nestjs-best-practices/SKILL.md` |
| `prisma-orm` | `.cursor/skills/marketplace-prisma-orm/SKILL.md` |
| `docker-expert` | `.cursor/skills/marketplace-docker-expert/SKILL.md` |
| `postgresql-table-design` | `.cursor/skills/marketplace-postgresql-table-design/SKILL.md` |
