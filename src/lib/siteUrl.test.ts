import { afterEach, describe, expect, it } from "vitest";
import { getSiteBaseUrl } from "@/lib/siteUrl";

const envBackup = { ...process.env };

afterEach(() => {
  process.env = { ...envBackup };
});

describe("getSiteBaseUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL when not localhost in production", () => {
    process.env.NODE_ENV = "production";
    process.env.VERCEL = "1";
    process.env.NEXT_PUBLIC_SITE_URL = "https://jade-revamp.vercel.app";
    delete process.env.VERCEL_URL;
    expect(getSiteBaseUrl()).toBe("https://jade-revamp.vercel.app");
  });

  it("ignores localhost SITE_URL on Vercel and uses VERCEL_URL", () => {
    process.env.NODE_ENV = "production";
    process.env.VERCEL = "1";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.VERCEL_URL = "jade-revamp.vercel.app";
    expect(getSiteBaseUrl()).toBe("https://jade-revamp.vercel.app");
  });

  it("keeps localhost in development", () => {
    process.env.NODE_ENV = "development";
    delete process.env.VERCEL;
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    expect(getSiteBaseUrl()).toBe("http://localhost:3000");
  });
});
