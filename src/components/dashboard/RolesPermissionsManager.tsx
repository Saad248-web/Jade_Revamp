"use client";

import { ShieldCheck } from "lucide-react";
import { ChevronRight } from "lucide-react";
import {
  ALL_ROLES,
  ROLE_LABELS,
  ROUTE_MATRIX,
  type AccessLevel,
} from "@/lib/auth/permissions";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { DashboardModuleFrame } from "./ui/DashboardModuleFrame";

const LEVEL_STYLE: Record<AccessLevel, string> = {
  write: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  read: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  none: "border-white/10 bg-white/[0.02] text-white/30",
};

const LEVEL_LABEL: Record<AccessLevel, string> = {
  write: "Write",
  read: "Read",
  none: "—",
};

export function RolesPermissionsManager() {
  return (
    <DashboardModuleFrame>
      <DashboardPanel pad className="w-full min-w-0">
        <p className="dashboard-data-table-scroll-hint" aria-hidden>
          <ChevronRight className="h-4 w-4" />
          Swipe for more columns
        </p>
        <div className={dash.dataTableWrap}>
          <table className={`${dash.dataTable} dash-roles-table`}>
            <thead>
              <tr>
                <th scope="col">Module / Route</th>
                {ALL_ROLES.map((r) => (
                  <th key={r} scope="col" className="text-center">
                    {ROLE_LABELS[r]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROUTE_MATRIX.map((entry) => (
                <tr key={entry.path}>
                  <td>
                    <p className="font-bold text-white">{entry.label}</p>
                    <p className="text-[length:var(--fs-desc)] text-[var(--dash-text-muted)]">
                      {entry.path}
                    </p>
                  </td>
                  {ALL_ROLES.map((r) => {
                    const level: AccessLevel = entry.perms[r] ?? "none";
                    return (
                      <td key={r} className="text-center">
                        <span
                          className={`inline-flex min-w-[58px] justify-center border px-2 py-1 text-xs font-bold uppercase tracking-widest ${LEVEL_STYLE[level]}`}
                        >
                          {LEVEL_LABEL[level]}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>

      <DashboardPanel pad>
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--dash-accent)]"
            aria-hidden
          />
          <div className={`${dash.muted} text-[length:var(--fs-desc)]`}>
            <p className="mb-1 font-bold text-[var(--dash-text)]">
              How enforcement works
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Middleware</strong> blocks page navigation and{" "}
                <strong>API routes</strong> check <code>requireRole</code> per
                handler.
              </li>
              <li>
                <strong>Team</strong> role is scoped to assigned villas on the
                calendar API.
              </li>
              <li>
                Changes here are documentation only — update{" "}
                <code>permissions.ts</code> and redeploy to change access.
              </li>
            </ul>
          </div>
        </div>
      </DashboardPanel>
    </DashboardModuleFrame>
  );
}
