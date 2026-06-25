"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export function DashboardFilterBar({ children, meta, className = "" }: Props) {
  return (
    <div className={`dash-filter-bar ${className}`.trim()}>
      {children}
      {meta != null && <div className="dash-filter-bar__meta">{meta}</div>}
    </div>
  );
}
