import * as Sentry from "@sentry/nestjs";

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.warn("SENTRY_DSN not set, Sentry disabled");
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 1.0,
  });
}
