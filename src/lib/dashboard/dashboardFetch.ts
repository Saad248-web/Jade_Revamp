/** Dashboard API fetch — NextAuth session cookie only (no legacy password bypass). */

const SUSPENDED_LOGIN = "/login?error=suspended";

export async function dashboardFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (typeof window !== "undefined" && res.status === 401) {
    try {
      const data = (await res.clone().json()) as {
        code?: string;
        error?: string;
      };
      const suspended =
        data.code === "ACCOUNT_SUSPENDED" ||
        data.error?.toLowerCase().includes("no longer active");
      if (suspended && !window.location.pathname.startsWith("/login")) {
        window.location.replace(SUSPENDED_LOGIN);
      }
    } catch {
      // non-JSON 401 — leave to caller
    }
  }

  if (typeof window !== "undefined" && res.status === 403) {
    try {
      const data = (await res.clone().json()) as { code?: string };
      if (data.code === "FORBIDDEN") {
        console.warn("[dashboard] Forbidden API access for current role");
      }
    } catch {
      /* ignore */
    }
  }

  return res;
}
