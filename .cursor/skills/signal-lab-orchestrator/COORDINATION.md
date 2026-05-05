# Orchestrator Coordination Notes

## Task Type → Skill Mapping

| Task Type | Skill to Use |
|-----------|-------------|
| database | `prisma-schema-review` |
| backend | `nestjs-endpoint-scaffold` |
| observability | `observability-integration` |
| frontend | (shadcn-ui marketplace skill) |
| infra | (docker-expert marketplace skill) |

## Model Selection Guide

### Fast Model Tasks (< 5 min, well-scoped)

- Add a field to Prisma schema
- Create a DTO class
- Add a decorator to controller
- Create a simple UI component
- Add a log statement
- Increment a metric counter
- Write a migration SQL
- Update .env.example

### Default Model Tasks (5-15 min, needs judgment)

- Design a new module architecture
- Implement complex business logic
- Integrate multiple systems (metrics + logs + Sentry)
- Review trade-offs between approaches
- Design database relations
- Create Grafana dashboard queries

## Subagent Types

| Phase | Subagent Type | Purpose |
|-------|--------------|---------|
| Analysis | general | Parse PRD structure |
| Codebase | explore | Scan project files |
| Planning | general | Architecture decisions |
| Decomposition | general | Task breakdown |
| Implementation | general | Execute tasks |
| Review | explore | Verify quality (readonly) |
| Report | general | Generate summary |
