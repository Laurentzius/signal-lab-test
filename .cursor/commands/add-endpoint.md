# /add-endpoint

Scaffold a new NestJS endpoint with full observability.

## Prompt

```
Create a new NestJS endpoint following the nestjs-endpoint-scaffold skill.

Requirements:
1. Create module, controller, service, and DTO files in apps/backend/src/<feature>/
2. Include proper Swagger decorators (@ApiTags, @ApiOperation)
3. Use PrismaService for database operations
4. Use MetricsService for custom metrics (if applicable)
5. Add structured JSON logging via `structuredLogger`
6. Handle errors with proper HTTP exceptions
7. Register the module in apps/backend/src/app.module.ts
8. Verify: endpoint responds, Swagger docs show it, logs are structured

Use the pattern from .cursor/skills/nestjs-endpoint-scaffold/SKILL.md
```
