"use client";

import type { ReactNode } from "react";
import { dash } from "@/lib/dashboard/dashboardClasses";

type DashboardPanelProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  fill?: boolean;
  pad?: boolean;
  header?: string;
};

export function DashboardPanel({
  children,
  className = "",
  contentClassName = "",
  fill = false,
  pad = false,
  header,
}: DashboardPanelProps) {
  const panelClass = [
    dash.panel,
    pad ? "dashboard-panel--pad" : "",
    fill ? "dashboard-panel--fill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={panelClass}>
      <div className={`${dash.panelBody} ${contentClassName}`.trim()}>
        {header && <div className={dash.panelHeader}>{header}</div>}
        {children}
      </div>
    </div>
  );
}

export { DashboardPanel as GlassPanel };
