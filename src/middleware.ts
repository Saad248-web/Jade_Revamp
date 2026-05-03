import { NextResponse, type NextRequest } from "next/server";
import { getClientIpFromHeaders, rateLimit } from "@/lib/rateLimit";

/**
 * Edge barrier for `/api/*`: allowed methods only, coarse rate limit per IP,
 * minimal extra response headers (defense-in-depth alongside `next.config` & per-route limits).
 *
 * Matcher excludes static assets automatically when scoped to `/api`.
 */
export function middleware(request: NextRequest) {
  const method = request.method.toUpperCase();
  if (
    !["GET", "POST", "HEAD", "OPTIONS", "PATCH", "DELETE"].includes(method)
  ) {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405, headers: noStoreJsonHeaders },
    );
  }

  if (method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...noStoreJsonHeaders,
      },
    });
  }

  const ip =
    request.ip ??
    getClientIpFromHeaders(request.headers) ??
    "unknown";

  const rl = rateLimit({
    key: `edge:api:${ip}`,
    limit: 600,
    windowMs: 60_000,
  });

  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...noStoreJsonHeaders,
          "Retry-After": String(rl.retryAfterSeconds),
        },
      },
    );
  }

  const res = NextResponse.next();

  res.headers.set("Cross-Origin-Resource-Policy", "same-site");
  res.headers.set("X-DNS-Prefetch-Control", "off");
  return res;
}

const noStoreJsonHeaders = {
  "Cache-Control": "no-store",
} as const;

export const config = {
  matcher: ["/api/:path*"],
};
