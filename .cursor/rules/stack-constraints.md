# Stack Constraints

## Allowed Technologies

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend Framework | Next.js (App Router) | Use `app/` directory, not `pages/` |
| UI Components | shadcn/ui | Import from `@/components/ui/` |
| Styling | Tailwind CSS | No CSS modules, no styled-components |
| Server State | TanStack Query | No SWR, no Redux for server state |
| Forms | React Hook Form + Zod | No Formik, no uncontrolled forms |
| Backend Framework | NestJS | TypeScript strict mode |
| Database | PostgreSQL 16 | Via Prisma only |
| ORM | Prisma | No TypeORM, no raw SQL |
| Metrics | prom-client | Prometheus format |
| Logging | Structured JSON | To Loki via Promtail |
| Error Tracking | Sentry | @sentry/nestjs |
| Containerization | Docker Compose | Single command startup |

## Forbidden

- Redux, Zustand, or any client state library for server data
- CSS modules, styled-components, emotion
- Raw SQL queries (use Prisma)
- TypeORM, Sequelize, or any other ORM
- SWR for data fetching
- Pages Router (`pages/` directory)
- JavaScript files (TypeScript only)
- `any` type (use proper typing)
