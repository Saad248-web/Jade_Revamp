/**
 * Canonical public site origin for emails, SEO, and absolute links.
 * In production, ignores localhost in NEXT_PUBLIC_SITE_URL and falls back to VERCEL_URL.
 */
export function getSiteBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const onVercel = process.env.VERCEL === "1";
  const isProd =
    process.env.NODE_ENV === "production" || onVercel;

  if (
    explicit &&
    !(isProd && /localhost|127\.0\.0\.1/i.test(explicit))
  ) {
    return explicit;
  }

  const vercelHost = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  if (explicit) return explicit;

  return "https://jaderetreats.com";
}
