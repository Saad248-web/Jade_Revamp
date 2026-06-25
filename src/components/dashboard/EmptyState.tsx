"use client";

import type { ReactNode } from "react";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardPanel } from "./DashboardPanel";

type EmptyTone = "neutral" | "info" | "success" | "warning";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: EmptyTone;
  compact?: boolean;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  compact = false,
}: EmptyStateProps) {
  const toneClass = tone !== "neutral" ? `dashboard-empty-state--${tone}` : "";
  const compactClass = compact ? "dashboard-empty-state--compact" : "";

  return (
    <DashboardPanel pad className="w-full">
      <div className={`${dash.emptyState} ${toneClass} ${compactClass}`.trim()}>
        {icon && <div className={dash.emptyStateIcon}>{icon}</div>}
        <h2 className={dash.emptyStateTitle}>{title}</h2>
        {description && <p className={dash.emptyStateDesc}>{description}</p>}
        {action}
      </div>
    </DashboardPanel>
  );
}
