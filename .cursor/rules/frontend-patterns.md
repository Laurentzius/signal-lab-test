# Frontend Patterns

## Component Structure

```
src/
├── app/              # Next.js App Router pages
├── components/
│   ├── ui/           # shadcn/ui components (don't modify)
│   └── *.tsx         # Application components
├── hooks/            # Custom React hooks
└── lib/              # Utilities and API client
```

## Data Fetching

Use TanStack Query for ALL server state:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["scenarios"],
  queryFn: () => apiFetch("/api/scenarios"),
});

const mutation = useMutation({
  mutationFn: (data) => apiFetch("/api/scenarios/run", { method: "POST", body: JSON.stringify(data) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scenarios"] }),
});
```

## Forms

Use React Hook Form with Zod validation:

```typescript
const form = useForm<FormData>({ resolver: zodResolver(schema) });
```

## UI Components

- Import from `@/components/ui/` (shadcn)
- Don't create custom Button, Card, Input — use shadcn versions
- Use `cn()` utility for conditional classes
- Use Lucide React for icons

## Rules

- **No** Redux, Zustand, or MobX for server state
- **No** CSS modules or styled-components
- **Always** use `"use client"` for interactive components
- **Always** handle loading and error states
- **Always** use shadcn components when available
