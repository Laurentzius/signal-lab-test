---
name: prisma-schema-review
description: Review Prisma schema changes, create migrations, and ensure proper patterns
---

# Prisma Schema Review Skill

## When to Use

- Modifying `prisma/schema.prisma`
- Adding new models or fields
- Before running `prisma migrate dev`
- Reviewing schema for best practices

## Instructions

### 1. Schema Change Checklist

Before making changes:
- [ ] Model uses `@id @default(cuid())` for primary key
- [ ] Timestamps use `@default(now())` for createdAt
- [ ] Field types are appropriate (String, Int, DateTime, Json, etc.)
- [ ] Relations use proper `@relation` directives
- [ ] No raw SQL or other ORM usage

### 2. Making Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name describe_your_change
# 3. Regenerate client
npx prisma generate
```

### 3. Common Patterns

**Adding a field:**
```prisma
model ScenarioRun {
  // existing fields...
  newField String?  // Optional field
}
```

**Adding a model:**
```prisma
model MyModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}
```

**Adding a relation:**
```prisma
model Child {
  id       String  @id @default(cuid())
  parentId String
  parent   Parent  @relation(fields: [parentId], references: [id])
}
```

### 4. After Migration

1. Update PrismaService if needed (usually auto-handled)
2. Update any services that query the changed model
3. Run `npx prisma generate` to update types
4. Verify the migration applied: `npx prisma migrate status`

### 5. Anti-patterns to Avoid

- ❌ Raw SQL queries
- ❌ Using `@map` without documentation
- ❌ Cascading deletes without consideration
- ❌ Required fields without defaults on existing tables
- ❌ Changing ID types after creation
