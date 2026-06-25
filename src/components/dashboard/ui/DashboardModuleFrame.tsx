"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardAlert } from "./DashboardAlert";

type DashboardModuleFrameProps = {
  toolbar?: ReactNode;
  note?: ReactNode;
  error?: string | null;
  success?: string | null;
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
};

export function DashboardModuleFrame({
  toolbar,
  note,
  error,
  success,
  loading,
  loadingLabel = "Loading…",
  children,
}: DashboardModuleFrameProps) {
  return (
    <div className={dash.module}>
      {toolbar}
      {note}
      {success && <DashboardAlert tone="success">{success}</DashboardAlert>}
      {error && <DashboardAlert tone="danger">{error}</DashboardAlert>}
      {loading ? (
        <div className={`${dash.loadingRow} dash-module__body`}>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span className={dash.muted}>{loadingLabel}</span>
        </div>
      ) : (
        <div className={dash.moduleBody}>{children}</div>
      )}
    </div>
  );
}
