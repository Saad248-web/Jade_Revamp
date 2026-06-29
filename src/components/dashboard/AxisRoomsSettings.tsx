"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Globe } from "lucide-react";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DataTable, type DataTableColumn } from "./DataTable";
import { DashboardListToolbar } from "./ui/DashboardListToolbar";
import { DashboardModuleFrame } from "./ui/DashboardModuleFrame";

type VillaMapping = {
  slug: string;
  name: string;
  axisPropertyId: string;
  axisRoomTypeId: string;
  axisRatePlanId: string;
};

export function AxisRoomsSettings() {
  const [rows, setRows] = useState<VillaMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"set" | "missing">("missing");
  const [exporting, setExporting] = useState(false);

  const unmappedCount = useMemo(
    () =>
      rows.filter(
        (r) => !r.axisPropertyId || !r.axisRoomTypeId || !r.axisRatePlanId,
      ).length,
    [rows],
  );

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await dashboardFetch("/api/dashboard/settings/axis-rooms/csv");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "jade-axisrooms-properties.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [villasRes, sysRes] = await Promise.all([
        dashboardFetch("/api/dashboard/villas?all=1"),
        dashboardFetch("/api/dashboard/dev/system"),
      ]);
      if (!villasRes.ok) throw new Error("Failed to load villas");
      const villasData = (await villasRes.json()) as {
        villas?: {
          slug: string;
          name: string;
        }[];
      };
      if (sysRes.ok) {
        const sys = (await sysRes.json()) as {
          secrets?: { AXIS_ROOMS_API_KEY?: string };
        };
        setApiStatus(
          (sys.secrets?.AXIS_ROOMS_API_KEY ?? "missing") as "set" | "missing",
        );
      }

      const detailRows: VillaMapping[] = [];
      for (const v of villasData.villas ?? []) {
        const d = await dashboardFetch(`/api/dashboard/villas/${v.slug}`);
        if (!d.ok) continue;
        const full = (await d.json()) as {
          villa?: {
            axisRooms?: {
              propertyId?: string;
              roomTypeId?: string;
              ratePlanId?: string;
            };
          };
        };
        const axis = full.villa?.axisRooms ?? {};
        detailRows.push({
          slug: v.slug,
          name: v.name,
          axisPropertyId: axis.propertyId ?? "",
          axisRoomTypeId: axis.roomTypeId ?? "",
          axisRatePlanId: axis.ratePlanId ?? "",
        });
      }
      setRows(detailRows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns: DataTableColumn<VillaMapping>[] = [
    {
      key: "villa",
      header: "Property",
      cell: (r) => (
        <div>
          <p className="font-bold text-white">{r.name}</p>
          <p className="font-mono text-xs text-white/40">{r.slug}</p>
        </div>
      ),
    },
    {
      key: "property",
      header: "Property ID",
      cell: (r) => (
        <span className="font-mono text-xs text-white/60">
          {r.axisPropertyId || "—"}
        </span>
      ),
    },
    {
      key: "room",
      header: "Room type",
      cell: (r) => (
        <span className="font-mono text-xs text-white/60">
          {r.axisRoomTypeId || "—"}
        </span>
      ),
    },
    {
      key: "rate",
      header: "Rate plan",
      cell: (r) => (
        <span className="font-mono text-xs text-white/60">
          {r.axisRatePlanId || "—"}
        </span>
      ),
    },
    {
      key: "edit",
      header: "",
      cell: (r) => (
        <Link
          href={`/dashboard/settings/villas?edit=${encodeURIComponent(r.slug)}`}
          className="font-manrope text-xs font-bold uppercase tracking-widest text-[var(--dash-accent)] hover:underline"
        >
          Edit mapping
        </Link>
      ),
    },
  ];

  return (
    <DashboardModuleFrame
      toolbar={
        <DashboardListToolbar
          meta={
            <span className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4 text-[var(--dash-accent)]" />
              <span className="dashboard-toolbar__meta--hide-sm">
                Axis Rooms API key:{" "}
                <span
                  className={
                    apiStatus === "set" ? "text-emerald-300" : "text-amber-300"
                  }
                >
                  {apiStatus === "set" ? "Configured" : "Awaiting credentials"}
                </span>
                {unmappedCount > 0 && (
                  <>
                    {" "}
                    · {unmappedCount} villa{unmappedCount === 1 ? "" : "s"} need
                    Axis IDs
                  </>
                )}
              </span>
            </span>
          }
          onRefresh={load}
          refreshing={loading}
        >
          <button
            type="button"
            onClick={exportCsv}
            disabled={exporting || loading}
            className={`${dash.btn} ${dash.btnGhost}`}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </DashboardListToolbar>
      }
      error={error}
      loading={loading}
      loadingLabel="Loading mappings…"
    >
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.slug}
        emptyMessage="No villas in portfolio."
        caption="Axis Rooms property mapping"
        stickyFirstColumn
        dense
      />
    </DashboardModuleFrame>
  );
}
