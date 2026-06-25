"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Link2, Images } from "lucide-react";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import { isUnoptimizedMediaUrl } from "@/lib/media/urls";
import { MediaPickerModal } from "@/components/dashboard/MediaPickerModal";

const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[#EFCD62]/90";
const inputClass =
  "w-full border border-white/15 bg-black/20 px-3 py-2.5 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[#EFCD62]/60 focus:outline-none";
const hintClass = "mt-1 font-manrope text-xs text-white/35";

type ImageUploadFieldProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  villaSlug: string;
  disabled?: boolean;
};

export function ImageUploadField({
  label,
  hint,
  value,
  onChange,
  villaSlug,
  disabled,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const onPick = async (file: File | null) => {
    if (!file || disabled) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("villaSlug", villaSlug);
      const res = await dashboardFetch("/api/dashboard/media/upload", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        publicUrl?: string;
        error?: string;
      };
      const url = data.publicUrl ?? data.url;
      if (!res.ok || !url) {
        throw new Error(data.error ?? "Upload failed");
      }
      onChange(url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-full shrink-0 overflow-hidden border border-white/15 bg-black/40 sm:h-32 sm:w-44">
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              className="object-cover"
              sizes="176px"
              unoptimized={isUnoptimizedMediaUrl(value)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20">
              <ImagePlus className="h-10 w-10" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              className={`${inputClass} pl-10`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/Villa_Retreats/... or /api/cms/media/..."
              disabled={disabled}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={disabled || uploading}
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-[40px] items-center gap-2 border border-[#EFCD62]/40 bg-[#EFCD62]/10 px-4 font-manrope text-xs font-bold uppercase tracking-wider text-[#EFCD62] transition-colors hover:bg-[#EFCD62]/20 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setPickerOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-2 border border-white/20 bg-white/5 px-4 font-manrope text-xs font-bold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <Images className="h-4 w-4" />
              Browse library
            </button>
            {value && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange("")}
                className="font-manrope text-xs text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {hint && <p className={hintClass}>{hint}</p>}
          {uploadError && (
            <p className="font-manrope text-xs text-red-400">{uploadError}</p>
          )}
        </div>
      </div>
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange(url)}
        contextSlug={villaSlug}
      />
    </div>
  );
}
