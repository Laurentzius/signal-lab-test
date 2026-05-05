# Prisma Patterns

## Schema Location

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Client import: `@prisma/client`

## Model Naming

- PascalCase for models: `ScenarioRun`
- snake_case for table names (if overridden)
- Use `@id @default(cuid())` for IDs
- Use `@default(now())` for timestamps

## Service Pattern

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

## Rules

- **Never** use raw SQL (`$queryRaw`, `$executeRaw`)
- **Never** use other ORM (TypeORM, Sequelize)
- **Always** use Prisma Client for database operations
- **Always** create migrations with `prisma migrate dev`
- **Always** generate client after schema changes: `prisma generate`
- Use `select` to limit returned fields when appropriate
- Use `include` for relations (not joins)
- Handle Prisma errors (`PrismaClientKnownRequestError`)

## Adding New Models

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name describe_change`
3. Run `npx prisma generate`
4. Create/update service in `apps/backend/src/`
