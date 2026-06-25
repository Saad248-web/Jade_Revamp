"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  FolderOpen,
  ImagePlus,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardModuleFrame } from "./ui/DashboardModuleFrame";
import { DashboardListToolbar } from "./ui/DashboardListToolbar";
import { DashboardTabBar } from "./ui/DashboardTabBar";
import { DashboardFilterBar } from "./ui/DashboardFilterBar";
import { EmptyState } from "./EmptyState";
import { roleCanWrite, type Role } from "@/lib/auth/permissions";
import { isUnoptimizedMediaUrl } from "@/lib/media/urls";
import { useSession } from "next-auth/react";
import "@/styles/media-library.css";

type MediaItem = {
  _id: string;
  storage: "gridfs" | "static";
  publicUrl: string;
  filename: string;
  mime: string;
  size?: number;
  width?: number;
  height?: number;
  folderSlug: string;
  alt: string;
  caption: string;
  tags: string[];
  missingAlt: boolean;
  usageCount: number;
  gridFsId?: string;
};

type MediaFolder = {
  slug: string;
  label: string;
  isSystem: boolean;
};

type PublicFolder = { name: string; path: string };

type UsageRef = {
  entityType: string;
  entityId: string;
  label: string;
  fieldPath: string;
};

function formatBytes(n?: number) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryManager() {
  const { data: session } = useSession();
  const role = session?.user?.role as Role | undefined;
  const canWrite = role ? roleCanWrite("/dashboard/media", role) : false;

  const [source, setSource] = useState<"uploads" | "static">("uploads");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [publicFolders, setPublicFolders] = useState<PublicFolder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("");
  const [mime, setMime] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MediaItem | null>(null);
  const [usage, setUsage] = useState<UsageRef[]>([]);
  const [savingMeta, setSavingMeta] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [staticFolder, setStaticFolder] = useState("Villa_Retreats");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        source,
        page: String(page),
        limit: "48",
      });
      if (q.trim()) params.set("q", q.trim());
      if (folder) params.set("folder", folder);
      if (mime) params.set("mime", mime);
      if (source === "static" && staticFolder) {
        params.set("folder", staticFolder);
      }

      const res = await dashboardFetch(`/api/dashboard/media?${params}`);
      if (!res.ok) throw new Error("Failed to load media");
      const data = (await res.json()) as {
        items?: MediaItem[];
        total?: number;
        folders?: MediaFolder[];
        publicFolders?: PublicFolder[];
      };
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setFolders(data.folders ?? []);
      if (data.publicFolders?.length) {
        setPublicFolders(data.publicFolders);
        if (!data.publicFolders.some((f) => f.path === staticFolder)) {
          setStaticFolder(data.publicFolders[0].path);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [source, page, q, folder, mime, staticFolder]);

  useEffect(() => {
    load();
  }, [load]);

  const loadDetail = async (id: string) => {
    setDetailId(id);
    const res = await dashboardFetch(`/api/dashboard/media/${encodeURIComponent(id)}`);
    if (!res.ok) return;
    const data = (await res.json()) as { asset?: MediaItem; usage?: UsageRef[] };
    setDetail(data.asset ?? null);
    setUsage(data.usage ?? []);
  };

  const saveDetail = async () => {
    if (!detail || !canWrite) return;
    setSavingMeta(true);
    try {
      const res = await dashboardFetch(
        `/api/dashboard/media/${encodeURIComponent(detail._id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alt: detail.alt,
            caption: detail.caption,
            tags: detail.tags,
            folderSlug: detail.folderSlug,
            publicUrl: detail.publicUrl,
          }),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingMeta(false);
    }
  };

  useEffect(() => {
    if (!detail) return;
    const t = window.setTimeout(() => {
      void saveDetail();
    }, 800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.alt, detail?.caption, detail?.tags, detail?.folderSlug]);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length || !canWrite) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folderSlug", folder || "general-assets");
        const res = await dashboardFetch("/api/dashboard/media/upload", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error("Upload failed");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const copyPath = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteSelected = async () => {
    if (!canWrite || !selected.size) return;
    const res = await dashboardFetch("/api/dashboard/media/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        ids: Array.from(selected),
      }),
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { errors?: unknown };
      setError("Some assets are in use and could not be deleted.");
      console.warn(d);
      return;
    }
    setSelected(new Set());
    await load();
  };

  const missingAltCount = items.filter((i) => i.missingAlt).length;

  return (
    <DashboardModuleFrame
      toolbar={
        <DashboardListToolbar onRefresh={load} refreshing={loading}>
          <div className={dash.toolbarSegment}>
            <DashboardTabBar
              tabs={[
                { id: "uploads", label: "Uploads", count: source === "uploads" ? total : undefined },
                {
                  id: "static",
                  label: "Public site",
                  count: source === "static" ? total : undefined,
                },
              ]}
              active={source}
              onChange={(id) => {
                setSource(id as "uploads" | "static");
                setPage(1);
              }}
            />
          </div>
        </DashboardListToolbar>
      }
      error={error}
      loading={loading && items.length === 0}
      loadingLabel="Loading media…"
    >
      <div className="media-library-layout">
        <DashboardFilterBar
          meta={
            <>
              <span className="dash-kpi__value" style={{ color: "var(--dash-accent)" }}>
                {total}
              </span>{" "}
              assets
              {missingAltCount > 0 && source === "uploads" && (
                <>
                  {" · "}
                  <span style={{ color: "var(--dash-warning)" }}>{missingAltCount}</span> missing alt
                </>
              )}
            </>
          }
        >
          <div className="dash-filter-bar__search">
            <Search className={`h-3.5 w-3.5 ${dash.filterSearchIcon}`} aria-hidden />
            <input
              className={dash.inputCompact}
              placeholder="Search name, alt, tags…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {source === "uploads" && (
            <select
              className={`${dash.inputCompact} ${dash.filterSelect}`}
              value={folder}
              onChange={(e) => {
                setFolder(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All folders</option>
              {folders.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.label}
                </option>
              ))}
            </select>
          )}

          {source === "static" && (
            <select
              className={`${dash.inputCompact} ${dash.filterSelect}`}
              value={staticFolder}
              onChange={(e) => {
                setStaticFolder(e.target.value);
                setPage(1);
              }}
            >
              {publicFolders.length > 0 ? (
                publicFolders.map((f) => (
                  <option key={f.path} value={f.path}>
                    {f.name}
                  </option>
                ))
              ) : (
                <option value={staticFolder}>Loading…</option>
              )}
            </select>
          )}

          <select
            className={`${dash.inputCompact} ${dash.filterSelect}`}
            value={mime}
            onChange={(e) => setMime(e.target.value)}
          >
            <option value="">All types</option>
            <option value="webp">WebP</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
          </select>

          <div className={dash.filterActions}>
            {canWrite && source === "uploads" && (
              <label className="media-library-dropzone">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  className="hidden"
                  onChange={(e) => void onUpload(e.target.files)}
                />
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#EFCD62]" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Upload
              </label>
            )}
            {selected.size > 0 && canWrite && (
              <button
                type="button"
                onClick={() => void deleteSelected()}
                className={`${dash.btn} ${dash.btnText} ${dash.btnDense} text-red-300`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete ({selected.size})
              </button>
            )}
          </div>
        </DashboardFilterBar>

        <div className="media-library-body">
        <div
          className="media-library-main"
          onDragOver={(e) => {
            if (canWrite && source === "uploads") e.preventDefault();
          }}
          onDrop={(e) => {
            if (!canWrite || source !== "uploads") return;
            e.preventDefault();
            void onUpload(e.dataTransfer.files);
          }}
        >
          <div className="media-library-grid">
            {items.map((item) => (
              <div
                key={item._id}
                className={`media-library-card group ${selected.has(item._id) ? "is-selected" : ""}`}
              >
                <button
                  type="button"
                  className="media-library-card-preview"
                  onClick={() => void loadDetail(item._id)}
                >
                  <Image
                    src={item.publicUrl}
                    alt={item.alt || item.filename}
                    fill
                    className="object-cover"
                    sizes="160px"
                    unoptimized={isUnoptimizedMediaUrl(item.publicUrl)}
                  />
                  {item.missingAlt && (
                    <span className="media-library-warn">No alt</span>
                  )}
                  {source === "static" && (
                    <span className="media-library-static-badge">Public</span>
                  )}
                </button>
                <div className="media-library-card-meta">
                  <p className="truncate text-xs font-medium text-white">
                    {item.filename}
                  </p>
                  <p className="truncate font-mono text-[10px] text-white/35">
                    {item.publicUrl}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <span className="text-[10px] text-white/40">
                      {formatBytes(item.size)}
                    </span>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        title="Copy path"
                        onClick={() => void copyPath(item.publicUrl)}
                        className="p-1 text-white/50 hover:text-[#EFCD62]"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      {canWrite && (
                        <button
                          type="button"
                          title="Select"
                          onClick={() => toggleSelect(item._id)}
                          className="p-1 text-white/50 hover:text-[#EFCD62]"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && items.length === 0 && (
            <EmptyState
              compact
              tone="info"
              icon={<ImagePlus className="h-8 w-8" />}
              title={source === "static" ? "No images in this folder" : "No uploads yet"}
              description={
                source === "static"
                  ? "Try another public folder or clear your search."
                  : "Upload images here or use Browse Library in the blog editor."
              }
              action={
                canWrite && source === "uploads" ? (
                  <label className="media-library-dropzone media-library-dropzone--panel">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      className="hidden"
                      onChange={(e) => void onUpload(e.target.files)}
                    />
                    {uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#EFCD62]" />
                    ) : (
                      <Upload className="h-5 w-5 text-[#EFCD62]/70" />
                    )}
                    Drag & drop or click to upload
                  </label>
                ) : undefined
              }
            />
          )}

          {total > 48 && (
            <div className="media-library-pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className={`${dash.btn} ${dash.btnText}`}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page * 48 >= total}
                onClick={() => setPage((p) => p + 1)}
                className={`${dash.btn} ${dash.btnText}`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {detail && (
          <aside className="media-library-detail">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-philosopher text-lg text-white">Asset details</h3>
              <button
                type="button"
                onClick={() => {
                  setDetail(null);
                  setDetailId(null);
                }}
                className="text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mb-3 aspect-video w-full overflow-hidden border border-white/10">
              <Image
                src={detail.publicUrl}
                alt=""
                fill
                className="object-contain"
                sizes="320px"
                unoptimized={isUnoptimizedMediaUrl(detail.publicUrl)}
              />
            </div>
            <p className="mb-2 truncate font-mono text-xs text-white/50">
              {detail.publicUrl}
            </p>
            <button
              type="button"
              onClick={() => void copyPath(detail.publicUrl)}
              className={`${dash.btn} ${dash.btnText} mb-4 w-full`}
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy path for CMS fields"}
            </button>
            <p className="mb-3 text-xs text-white/40">
              Paste this path into blog featured image, villa thumbnail, or any image URL field.
            </p>

            {canWrite && (
              <div className={dash.stack}>
                <div>
                  <label className={dash.label}>Alt text</label>
                  <input
                    className={`${dash.input} w-full`}
                    value={detail.alt}
                    onChange={(e) =>
                      setDetail({ ...detail, alt: e.target.value })
                    }
                  />
                  {!detail.alt.trim() && (
                    <p className="mt-1 text-xs text-amber-300">Missing alt — SEO warning</p>
                  )}
                </div>
                <div>
                  <label className={dash.label}>Caption</label>
                  <input
                    className={`${dash.input} w-full`}
                    value={detail.caption}
                    onChange={(e) =>
                      setDetail({ ...detail, caption: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={dash.label}>Tags</label>
                  <input
                    className={`${dash.input} w-full`}
                    value={detail.tags.join(", ")}
                    onChange={(e) =>
                      setDetail({
                        ...detail,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
                {source === "uploads" && (
                  <div>
                    <label className={dash.label}>Folder</label>
                    <select
                      className={`${dash.input} w-full`}
                      value={detail.folderSlug}
                      onChange={(e) =>
                        setDetail({ ...detail, folderSlug: e.target.value })
                      }
                    >
                      {folders.map((f) => (
                        <option key={f.slug} value={f.slug}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {savingMeta && (
                  <p className="text-xs text-emerald-300/80">Saving…</p>
                )}
              </div>
            )}

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className={dash.label}>Usage</p>
              {usage.length === 0 ? (
                <p className="text-sm text-white/40">Not referenced in CMS yet.</p>
              ) : (
                <ul className="space-y-1 text-sm text-white/60">
                  {usage.map((u, i) => (
                    <li key={i}>
                      {u.label}{" "}
                      <span className="text-white/30">({u.entityType})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <dl className="mt-4 space-y-1 text-xs text-white/45">
              <div className="flex justify-between">
                <dt>Type</dt>
                <dd>{detail.mime}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Size</dt>
                <dd>{formatBytes(detail.size)}</dd>
              </div>
              {detail.width && detail.height && (
                <div className="flex justify-between">
                  <dt>Dimensions</dt>
                  <dd>
                    {detail.width}×{detail.height}
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        )}
        </div>
      </div>
    </DashboardModuleFrame>
  );
}
