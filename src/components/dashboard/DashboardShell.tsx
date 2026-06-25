"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardHeader } from "./DashboardHeader";
import { Sidebar } from "./Sidebar";
import {
  dashboardSectionForPath,
  dashboardDescriptionForPath,
  dashboardTitleForPath,
} from "./navConfig";

type DashboardShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function DashboardShell({
  children,
  title,
  description,
  onRefresh,
  refreshing = false,
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!session?.user?.role) {
      void signOut({ redirect: false }).then(() => {
        router.replace("/login?error=suspended");
      });
    }
  }, [status, session?.user?.role, pathname, router]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    let cancelled = false;
    const verify = async () => {
      try {
        const res = await fetch("/api/auth/session-status", {
          credentials: "include",
          cache: "no-store",
        });
        if (cancelled) return;
        if (res.status === 401) {
          const data = (await res.json().catch(() => ({}))) as {
            code?: string;
          };
          await signOut({ redirect: false });
          router.replace(
            data.code === "ACCOUNT_SUSPENDED"
              ? "/login?error=suspended"
              : "/login",
          );
        }
      } catch {
        /* network blip */
      }
    };
    void verify();
    const id = window.setInterval(verify, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [status, session?.user?.id, router]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const pageTitle = title ?? dashboardTitleForPath(pathname);
  const section = dashboardSectionForPath(pathname);
  const pageDescription =
    description ?? dashboardDescriptionForPath(pathname);

  useEffect(() => {
    document.title = `${pageTitle} | Jade Host`;
  }, [pageTitle]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    await fetch("/api/auth/staff-login", { method: "DELETE" });
    router.replace("/login");
  };

  if (status === "loading") {
    return (
      <div className={`${dash.root} flex min-h-[100dvh] items-center justify-center`}>
        <p className={dash.muted}>Loading dashboard…</p>
      </div>
    );
  }

  if (status !== "authenticated" || !session?.user?.role) {
    return null;
  }

  return (
    <div className={dash.root}>
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        role={session.user.role}
        userName={session.user.name ?? session.user.email ?? "Staff"}
        userEmail={session.user.email}
      />

      <div className={dash.main}>
        <DashboardHeader
          pageTitle={pageTitle}
          section={section}
          description={pageDescription}
          onOpenNav={() => setDrawerOpen(true)}
          onLogout={handleLogout}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />

        <main className={dash.content}>
          <div className={dash.page}>{children}</div>
        </main>
      </div>
    </div>
  );
}
