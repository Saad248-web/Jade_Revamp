"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Search, X } from "lucide-react";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { isUnoptimizedMediaUrl } from "@/lib/media/urls";
import { GLASS_CHROME_FRAME_CLASS } from "@/lib/glassChrome";

type MediaItem = {
  _id: string;
  publicUrl: string;
  filename: string;
  alt: string;
  storage: "gridfs" | "static";
};

type MediaPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, meta?: { alt?: string }) => void;
  /** e.g. blog/my-slug, villa/magnolia — sets default upload folder */
  contextSlug?: string;
  title?: string;
};

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  contextSlug = "general",
  title = "Select from Media Library",
}: MediaPickerModalProps) {
  const [source, setSource] = useState<"uploads" | "static">("uploads");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [staticFolder, setStaticFolder] = useState("Villa_Retreats");
  const [publicFolders, setPublicFolders] = useState<{ name: string; path: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!open) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        source,
        page: "1",
        limit: "60",
      });
      if (q.trim()) params.set("q", q.trim());
      if (source === "static") params.set("folder", staticFolder);

      const res = await dashboardFetch(`/api/dashboard/media?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as {
        items?: MediaItem[];
        publicFolders?: { name: string; path: string }[];
      };
      setItems(data.items ?? []);
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
  }, [open, source, q, staticFolder]);

  useEffect(() => {
    void load();
  }, [load]);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("villaSlug", contextSlug);
        const res = await dashboardFetch("/api/dashboard/media/upload", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = (await res.json()) as { url?: string; publicUrl?: string };
        const url = data.publicUrl ?? data.url;
        if (url) {
          onSelect(url);
          onClose();
          return;
        }
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={dash.modalOverlay} onClick={onClose}>
      <div
        className={`${GLASS_CHROME_FRAME_CLASS} ${dash.modalWide} max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-philosopher text-xl text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSource("uploads")}
              className={`${dash.btn} ${source === "uploads" ? dash.btnAccent : dash.btnText}`}
            >
              Uploads
            </button>
            <button
              type="button"
              onClick={() => setSource("static")}
              className={`${dash.btn} ${source === "static" ? dash.btnAccent : dash.btnText}`}
            >
              Public site
            </button>
            <label className={`${dash.btn} ${dash.btnText} cursor-pointer`}>
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Upload new"
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                disabled={uploading}
                onChange={(e) => void onUpload(e.target.files)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                className={`${dash.input} w-full pl-10`}
                placeholder="Search…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            {source === "static" && (
              <select
                className={dash.input}
                value={staticFolder}
                onChange={(e) => setStaticFolder(e.target.value)}
              >
                {publicFolders.length > 0 ? (
                  publicFolders.map((f) => (
                    <option key={f.path} value={f.path}>
                      {f.name}
                    </option>
                  ))
                ) : (
                  <option value={staticFolder}>Loading folders…</option>
                )}
              </select>
            )}
          </div>

          {error && <p className={dash.errorText}>{error}</p>}

          {loading ? (
            <div className={dash.loadingRow}>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className={dash.muted}>Loading…</span>
            </div>
          ) : (
            <div className="media-picker-grid">
              {items.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  className="media-picker-card"
                  title={item.publicUrl}
                  onClick={() => {
                    onSelect(item.publicUrl, { alt: item.alt });
                    onClose();
                  }}
                >
                  <Image
                    src={item.publicUrl}
                    alt={item.alt || item.filename}
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized={isUnoptimizedMediaUrl(item.publicUrl)}
                  />
                  {item.storage === "static" && (
                    <span className="media-library-static-badge">Public</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <p className={dash.muted}>
              No images found. Upload one or browse another folder.
            </p>
          )}

          <p className={dash.muted}>
            Tip: Public site images use paths like{" "}
            <code className="text-white/50">/Villa_Retreats/...</code> — copy
            and paste into any image field.
          </p>
        </div>
      </div>
    </div>
  );
}
