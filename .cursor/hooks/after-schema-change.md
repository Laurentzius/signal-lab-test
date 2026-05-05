---
name: after-schema-change
description: Reminds to run Prisma migration and regenerate client after schema changes
trigger: after modifying prisma/schema.prisma
---

# After Schema Change Hook

## Problem

Developers often forget to run `prisma migrate dev` and `prisma generate` after editing the schema, leading to type errors and stale database state.

## Action

After modifying `prisma/schema.prisma`, remind:

1. Run `npx prisma migrate dev --name <descriptive_name>`
2. Run `npx prisma generate`
3. Update any services that query the changed model
4. Check for breaking changes (removed fields, changed types)

## Check

```bash
# Check if migration is needed
npx prisma migrate status

# Check if client is up to date
npx prisma generate --dry-run 2>&1 | grep -q "up to date"
```

## Output

```
⚠️ Prisma schema was modified. Don't forget to:
  1. npx prisma migrate dev --name <describe_change>
  2. npx prisma generate
  3. Update affected services
  4. Test the migration: npx prisma migrate status
```

## Breaking Changes Warning

If the change includes:
- Removing a required field → warn about data loss
- Changing a field type → warn about migration complexity
- Adding a required field without default → warn about existing rows
