# Error Handling

## Backend Error Handling

### HTTP Exceptions

Use NestJS built-in exceptions:

```typescript
throw new BadRequestException("Invalid input");
throw new InternalServerErrorException("Something broke");
```

### Custom Errors (Teapot)

For non-standard HTTP codes, use the HttpExceptionFilter pattern:

```typescript
throw new (class extends Error {
  status = 418;
  response = { message: "I'm a teapot", signal: 42 };
})("I'm a teapot");
```

### Global Exception Filter

All errors pass through `HttpExceptionFilter` which:
- Catches all exceptions
- Returns consistent JSON: `{ statusCode, message, timestamp, path }`
- Logs errors to structured logger

### Sentry

- Capture `system_error` exceptions with `Sentry.captureException()`
- Don't capture validation errors (they're expected)

## Frontend Error Handling

### API Errors

The `apiFetch` utility throws on non-2xx responses. Catch in mutations:

```typescript
onError: (error) => {
  toast({ title: "Error", description: error.message, variant: "destructive" });
}
```

### Rules

- **Never** swallow errors silently
- **Always** show user-facing errors via toast
- **Always** log errors to console in development
- **Never** expose internal error details to users in production
