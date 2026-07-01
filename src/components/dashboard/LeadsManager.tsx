"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Inbox, Loader2 } from "lucide-react";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { roleCanWrite, type Role } from "@/lib/auth/permissions";
import { LEAD_SOURCE_LABELS } from "@/lib/leads/sourceLabels";
import { DataTable, type DataTableColumn } from "./DataTable";
import { DashStatusChip } from "./form";
import { EmptyState } from "./EmptyState";
import { DashboardListToolbar } from "./ui/DashboardListToolbar";
import { DashboardModuleFrame } from "./ui/DashboardModuleFrame";
import { DashboardTabBar } from "./ui/DashboardTabBar";
import { DashboardPanel } from "./DashboardPanel";

export type LeadRow = {
  id: string;
  kind: "enquiry" | "partner";
  source: string;
  sourceLabel: string;
  email: string | null;
  name: string;
  phone: string | null;
  status: string;
  staffNotes: string;
  payload: Record<string, unknown>;
  photoCount?: number;
  createdAt: string | null;
};

const STATUS_VARIANT: Record<string, "info" | "success" | "warning" | "neutral"> = {
  new: "info",
  contacted: "warning",
  closed: "success",
};

type TabKind = "enquiry" | "partner";

export function LeadsManager() {
  const { data: session } = useSession();
  const role = session?.user?.role as Role | undefined;
  const canWrite = role ? roleCanWrite("/dashboard/leads", role) : false;

  const [tab, setTab] = useState<TabKind>("enquiry");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState("new");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ kind: tab, limit: "80" });
      if (tab === "enquiry" && sourceFilter !== "all") {
        params.set("source", sourceFilter);
      }
      const res = await dashboardFetch(`/api/dashboard/leads?${params}`);
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error ?? "Failed to load leads");
      }
      const data = (await res.json()) as { leads?: LeadRow[] };
      setRows(data.leads ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [tab, sourceFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (selected) {
      setNotesDraft(selected.staffNotes);
      setStatusDraft(selected.status);
    }
  }, [selected]);

  const saveLead = async () => {
    if (!selected || !canWrite) return;
    setSaving(true);
    setError(null);
    try {
      const res = await dashboardFetch("/api/dashboard/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: selected.kind,
          leadId: selected.id,
          status: statusDraft,
          staffNotes: notesDraft,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setSelected(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const sourceTabs = useMemo(
    () => [
      { id: "all", label: "All sources" },
      ...Object.entries(LEAD_SOURCE_LABELS).map(([id, label]) => ({
        id,
        label,
      })),
    ],
    [],
  );

  const columns: DataTableColumn<LeadRow>[] = [
    {
      key: "when",
      header: "Received",
      cell: (r) => (
        <span className="text-xs text-white/55">
          {r.createdAt
            ? new Date(r.createdAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      cell: (r) => (
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--dash-accent)]">
          {r.sourceLabel}
        </span>
      ),
    },
    {
      key: "guest",
      header: "Contact",
      cell: (r) => (
        <div>
          <p className="font-semibold text-white">{r.name}</p>
          <p className="text-xs text-white/50">{r.email ?? r.phone ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <DashStatusChip variant={STATUS_VARIANT[r.status] ?? "neutral"}>
          {r.status}
        </DashStatusChip>
      ),
    },
    {
      key: "action",
      header: "",
      cell: (r) => (
        <button
          type="button"
          onClick={() => setSelected(r)}
          className="font-manrope text-xs font-bold uppercase tracking-widest text-[var(--dash-accent)] hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <DashboardModuleFrame
      toolbar={
        <DashboardListToolbar
          meta={`${rows.length} lead${rows.length === 1 ? "" : "s"}`}
          onRefresh={load}
          refreshing={loading}
        />
      }
      error={error}
      loading={loading}
      loadingLabel="Loading leads…"
    >
      <DashboardTabBar
        tabs={[
          { id: "enquiry", label: "Enquiries" },
          { id: "partner", label: "Partner leads" },
        ]}
        active={tab}
        onChange={(id) => {
          setTab(id as TabKind);
          setSelected(null);
        }}
        className="mb-4"
      />

      {tab === "enquiry" ? (
        <DashboardTabBar
          tabs={sourceTabs}
          active={sourceFilter}
          onChange={setSourceFilter}
          className="mb-4"
        />
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          icon={<Inbox />}
          title="No leads yet"
          description="Enquiry form submissions from the public site appear here with their page tag (Wedding, Party villas, etc.)."
        />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => `${r.kind}-${r.id}`}
          caption="Leads and enquiries"
          dense
        />
      )}

      {selected ? (
        <div className="fixed inset-0 z-[var(--dash-z-modal)] flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <DashboardPanel pad className="max-h-[85dvh] w-full max-w-lg overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--dash-accent)]">
                  {selected.sourceLabel}
                </p>
                <h3 className="font-philosopher text-xl text-white">{selected.name}</h3>
                <p className="text-sm text-white/55">
                  {selected.email ?? selected.phone ?? "No contact"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={`${dash.btn} ${dash.btnGhost} ${dash.btnDense}`}
              >
                Close
              </button>
            </div>

            <pre className="mt-4 max-h-40 overflow-auto rounded-sm bg-black/40 p-3 font-mono text-xs text-white/70">
              {JSON.stringify(selected.payload, null, 2)}
            </pre>

            {canWrite ? (
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40">
                  Status
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    className={`${dash.inputCompact} mt-1 w-full`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40">
                  Staff notes
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    rows={4}
                    className={`${dash.inputCompact} mt-1 w-full`}
                  />
                </label>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveLead()}
                  className={`${dash.btn} ${dash.btnAccent} w-full`}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save
                </button>
              </div>
            ) : null}
          </DashboardPanel>
        </div>
      ) : null}
    </DashboardModuleFrame>
  );
}
