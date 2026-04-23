const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0B2C23"/>
      <stop offset="1" stop-color="#EFCD62"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="40" fill="url(#g)"/>
  <text x="90" y="115" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="84" font-weight="800" fill="#111827">
    J
  </text>
</svg>`;

export function GET() {
  return new Response(svg, {
    headers: {
      // iOS prefers PNG, but serving something (vs 404) avoids console noise in dev.
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400, immutable",
    },
  });
}

