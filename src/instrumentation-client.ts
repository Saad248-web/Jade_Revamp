import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  tracesSampleRate: process.env.NODE_ENV === "development" ? 0.35 : 0.08,
});

/** Instrument App Router navigations when tracing is enabled (see @sentry/nextjs build hint). */
export const onRouterTransitionStart =
  Sentry.captureRouterTransitionStart;
