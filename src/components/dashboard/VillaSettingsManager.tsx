"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  BedDouble,
  Building2,
  CalendarDays,
  Heart,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { roleCanWrite, type Role } from "@/lib/auth/permissions";
import { DashboardPanel } from "./DashboardPanel";
import { DashboardModuleFrame } from "./ui/DashboardModuleFrame";
import { DashboardFilterBar } from "./ui/DashboardFilterBar";
import { DashboardTabBar } from "./ui/DashboardTabBar";
import { DashboardStatusBadge } from "./ui/DashboardStatusBadge";
import { EmptyState } from "./EmptyState";
import { VillaEditModal } from "./VillaEditModal";
import { PropertyWizard } from "./PropertyWizard";

type DisplayStats = {
  stay: string | null;
  events: string | null;
  bhk: string | null;
  lawn: string | null;
  villaArea: string | null;
  pool: string | null;
};

type VillaRow = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: string | null;
  location: string | null;
  thumbnail: string | null;
  status: string;
  bookable: boolean;
  weddingVenue: boolean;
  portfolioSource: string;
  basePriceRupees: number;
  dayOutBasePriceRupees: number;
  stayBasePax: number;
  dayOutBasePax: number;
  stayMaxPax: number;
  displayStats: DisplayStats;
};

type FilterKey = "all" | "bookable" | "wedding" | "offline" | "coming_soon";

const SOURCE_LABEL: Record<string, string> = {
  canonical: "Portfolio",
  legacy: "Legacy listing",
  coming_soon: "Coming soon",
};

function fmtRupees(n: number): string {
  if (n <= 0) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function statusTone(status: string): "success" | "warning" | "neutral" {
  if (status === "active") return "success";
  if (status === "maintenance") return "warning";
  return "neutral";
}

function VillaPortfolioCard({
  villa: v,
  canWrite,
  onEdit,
  onFullEdit,
}: {
  villa: VillaRow;
  canWrite: boolean;
  onEdit: () => void;
  onFullEdit: () => void;
}) {
  const specs = [
    v.displayStats.bhk && { icon: <BedDouble className="h-3 w-3" />, label: v.displayStats.bhk },
    v.displayStats.stay && { icon: <Users className="h-3 w-3" />, label: v.displayStats.stay },
    v.displayStats.events && {
      icon: <CalendarDays className="h-3 w-3" />,
      label: v.displayStats.events,
    },
    v.displayStats.villaArea && {
      icon: <Building2 className="h-3 w-3" />,
      label: v.displayStats.villaArea,
    },
    v.displayStats.lawn && { icon: <MapPin className="h-3 w-3" />, label: v.displayStats.lawn },
    v.displayStats.pool && { icon: <Sparkles className="h-3 w-3" />, label: v.displayStats.pool },
  ].filter(Boolean) as { icon: ReactNode; label: string }[];

  return (
    <DashboardPanel className="villa-portfolio-card group transition-colors hover:border-white/20">
      <div className="villa-portfolio-card__layout">
        <div className="villa-portfolio-card__media">
          {v.thumbnail ? (
            <Image
              src={v.thumbnail}
              alt={v.shortName}
              fill
              priority={false}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 176px"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#25282C] to-black">
              <Building2 className="h-10 w-10 text-white/10" />
            </div>
          )}
        </div>

        <div className="villa-portfolio-card__body">
          <div className="villa-portfolio-card__identity">
            <div className="villa-portfolio-card__meta-row">
              <DashboardStatusBadge tone={statusTone(v.status)}>
                {v.status}
              </DashboardStatusBadge>
              {v.weddingVenue && (
                <DashboardStatusBadge tone="accent">Wedding</DashboardStatusBadge>
              )}
              {!v.bookable && (
                <DashboardStatusBadge tone="warning">Offline</DashboardStatusBadge>
              )}
              <span className="ml-auto text-[0.625rem] font-semibold uppercase tracking-wider text-white/35">
                {SOURCE_LABEL[v.portfolioSource] ?? v.portfolioSource}
              </span>
            </div>

            <div>
              <h3 className="villa-portfolio-card__title">{v.shortName}</h3>
              <p className="villa-portfolio-card__slug">{v.slug}</p>
            </div>

            {v.type && (
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dash-accent)]">
                {v.type}
              </p>
            )}

            {v.location && (
              <p className="flex items-start gap-1.5 text-xs leading-snug text-white/55">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--dash-accent)]/70" />
                <span className="min-w-0">{v.location}</span>
              </p>
            )}

            {specs.length > 0 && (
              <div className="villa-portfolio-card__specs">
                {specs.map((s) => (
                  <span key={s.label} className="villa-portfolio-card__spec">
                    <span className="text-[var(--dash-accent)]/70">{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <aside className="villa-portfolio-card__rates">
            <div className="villa-portfolio-card__rate-grid">
              <div className="villa-portfolio-card__rate villa-portfolio-card__rate--stay">
                <p className="villa-portfolio-card__rate-label">Stay</p>
                <p className="villa-portfolio-card__rate-value">
                  {fmtRupees(v.basePriceRupees)}
                </p>
                <p className="villa-portfolio-card__rate-hint">
                  ≤{v.stayBasePax} · max {v.stayMaxPax}
                </p>
              </div>
              <div className="villa-portfolio-card__rate">
                <p className="villa-portfolio-card__rate-label">Day-out</p>
                <p className="villa-portfolio-card__rate-value">
                  {fmtRupees(v.dayOutBasePriceRupees)}
                </p>
                <p className="villa-portfolio-card__rate-hint">≤{v.dayOutBasePax} guests</p>
              </div>
            </div>
            <div className="villa-portfolio-card__actions">
              <button
                type="button"
                onClick={onEdit}
                className={`${dash.btn} ${dash.btnAccent} ${dash.btnDense} w-full`}
              >
                <Pencil className="h-3.5 w-3.5" />
                {canWrite ? "Quick edit" : "View"}
              </button>
              {canWrite && (
                <button
                  type="button"
                  onClick={onFullEdit}
                  className={`${dash.btn} ${dash.btnText} ${dash.btnDense} w-full`}
                >
                  Full editor
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </DashboardPanel>
  );
}

export function VillaSettingsManager() {
  const { data: session } = useSession();
  const role = session?.user?.role as Role | undefined;
  const canWrite = role ? roleCanWrite("/dashboard/settings/villas", role) : false;

  const [villas, setVillas] = useState<VillaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [wizard, setWizard] = useState<
    null | { mode: "create" } | { mode: "edit"; slug: string }
  >(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardFetch("/api/dashboard/villas?all=1");
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error ?? "Failed to load villas");
      }
      const data = (await res.json()) as { villas?: VillaRow[] };
      setVillas(data.villas ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load villas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const bookable = villas.filter((v) => v.bookable).length;
    const wedding = villas.filter((v) => v.weddingVenue).length;
    const offline = villas.filter((v) => !v.bookable).length;
    const comingSoon = villas.filter((v) => v.portfolioSource === "coming_soon").length;
    return { total: villas.length, bookable, wedding, offline, comingSoon };
  }, [villas]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return villas.filter((v) => {
      if (filter === "bookable" && !v.bookable) return false;
      if (filter === "wedding" && !v.weddingVenue) return false;
      if (filter === "offline" && v.bookable) return false;
      if (filter === "coming_soon" && v.portfolioSource !== "coming_soon") {
        return false;
      }
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.slug.toLowerCase().includes(q) ||
        (v.location?.toLowerCase().includes(q) ?? false) ||
        (v.type?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [villas, query, filter]);

  const filterTabs = [
    { id: "all", label: "All", count: stats.total },
    { id: "bookable", label: "Bookable", count: stats.bookable },
    { id: "wedding", label: "Wedding", count: stats.wedding },
    { id: "offline", label: "Offline", count: stats.offline },
    { id: "coming_soon", label: "Coming soon", count: stats.comingSoon },
  ];

  return (
    <div className="w-full max-w-none">
      <div className="villa-settings-kpis dash-kpi-strip" role="group" aria-label="Portfolio summary">
        <div className="dash-kpi dash-kpi--accent">
          <span className="dash-kpi__label">Portfolio</span>
          <span className="dash-kpi__value">{stats.total}</span>
        </div>
        <div className="dash-kpi dash-kpi--success">
          <span className="dash-kpi__label">Bookable</span>
          <span className="dash-kpi__value">{stats.bookable}</span>
        </div>
        <div className="dash-kpi">
          <span className="dash-kpi__label">Wedding</span>
          <span className="dash-kpi__value">{stats.wedding}</span>
        </div>
        <div className="dash-kpi dash-kpi--warning">
          <span className="dash-kpi__label">Offline</span>
          <span className="dash-kpi__value">{stats.offline}</span>
        </div>
      </div>

      <DashboardModuleFrame
        toolbar={
          canWrite ? (
            <div className={dash.toolbarActionsList} role="toolbar">
              <div className={dash.toolbarSegment}>
                <button
                  type="button"
                  onClick={() => setWizard({ mode: "create" })}
                  className={`${dash.btn} ${dash.btnAccent} ${dash.btnDense}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add property
                </button>
              </div>
            </div>
          ) : undefined
        }
        error={error}
        loading={loading}
        loadingLabel="Loading portfolio…"
      >
        <DashboardFilterBar
          meta={
            <>
              <strong className="text-[var(--dash-accent)]">{filtered.length}</strong> of{" "}
              {stats.total} properties
            </>
          }
        >
          <div className="dash-filter-bar__search">
            <Search className={`h-3.5 w-3.5 ${dash.filterSearchIcon}`} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, slug, location…"
              className={dash.inputCompact}
            />
          </div>
          <DashboardTabBar
            tabs={filterTabs}
            active={filter}
            onChange={(id) => setFilter(id as FilterKey)}
          />
        </DashboardFilterBar>

        {filtered.length === 0 ? (
          <EmptyState
            compact
            title="No matches"
            description='Try another filter or run "npm run seed:villas" to sync portfolio data.'
          />
        ) : (
          <div className="villa-settings-list">
            {filtered.map((v) => (
              <VillaPortfolioCard
                key={v.id}
                villa={v}
                canWrite={canWrite}
                onEdit={() => setEditSlug(v.slug)}
                onFullEdit={() => setWizard({ mode: "edit", slug: v.slug })}
              />
            ))}
          </div>
        )}
      </DashboardModuleFrame>

      {editSlug && (
        <VillaEditModal
          slug={editSlug}
          canWrite={canWrite}
          onClose={() => setEditSlug(null)}
          onSaved={load}
          onOpenFullEditor={() => {
            const s = editSlug;
            setEditSlug(null);
            setWizard({ mode: "edit", slug: s });
          }}
        />
      )}

      {wizard && (
        <PropertyWizard
          mode={wizard.mode}
          slug={wizard.mode === "edit" ? wizard.slug : undefined}
          canWrite={canWrite}
          onClose={() => setWizard(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
