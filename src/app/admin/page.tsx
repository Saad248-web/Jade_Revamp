"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  RefreshCw,
  LogOut,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Calendar,
  Users,
  IndianRupee,
  Home,
  Phone,
  Mail,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  BedDouble,
  TrendingUp,
  AlertTriangle,
  Star,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────── */
interface Booking {
  id: string;
  villa_id: string;
  villa_name: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  pets: number;
  full_name: string;
  phone: string;
  email: string;
  notes: string;
  add_ons: string[];
  base_price: number;
  add_on_total: number;
  tax_amount: number;
  total_price: number;
  status: "confirmed" | "cancelled" | "pending";
  created_at: string;
}

type SortKey =
  | "created_at"
  | "check_in"
  | "total_price"
  | "villa_name"
  | "full_name";
type SortDir = "asc" | "desc";

/* ─────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, "0");

function fmtDate(raw: string) {
  // raw is "YYYY-MM-DD" from DB — parse without timezone shift
  const [y, m, d] = raw.split("T")[0].split("-").map(Number);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function fmtDateTime(raw: string) {
  const d = new Date(raw);
  return (
    d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
}

function fmtRupees(n: number) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function nights(ci: string, co: string) {
  const a = new Date(ci).getTime();
  const b = new Date(co).getTime();
  return Math.round((b - a) / 86400000);
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function shortId(id: string) {
  return id.split("-")[0].toUpperCase();
}

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};
const STATUS_ICON: Record<string, React.ReactNode> = {
  confirmed: <CheckCircle2 className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
  pending: <Clock className="w-3 h-3" />,
};

/* ─────────────────────────────────────────────────────────────────────
   CSV Export
───────────────────────────────────────────────────────────────────── */
function exportCSV(bookings: Booking[]) {
  const headers = [
    "ID",
    "Villa",
    "Guest",
    "Phone",
    "Email",
    "Check-in",
    "Check-out",
    "Nights",
    "Adults",
    "Children",
    "Pets",
    "Base Price",
    "Add-on Total",
    "Tax",
    "Total Price",
    "Add-ons",
    "Notes",
    "Status",
    "Booked On",
  ];
  const rows = bookings.map((b) => [
    shortId(b.id),
    b.villa_name,
    b.full_name,
    b.phone,
    b.email,
    b.check_in.split("T")[0],
    b.check_out.split("T")[0],
    nights(b.check_in, b.check_out),
    b.adults,
    b.children,
    b.pets,
    b.base_price,
    b.add_on_total,
    b.tax_amount,
    b.total_price,
    (b.add_ons ?? []).join("|"),
    (b.notes ?? "").replace(/,/g, ";"),
    b.status,
    new Date(b.created_at).toISOString().split("T")[0],
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `jade-bookings-${todayISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────────────────────────────
   Login Screen
───────────────────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/bookings", {
      headers: { "x-admin-password": pw },
    });
    setLoading(false);
    if (res.ok) onLogin(pw);
    else setError("Incorrect password");
  };

  return (
    <div className="min-h-screen bg-[#0B2C23] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-5"
      >
        <div className="text-center mb-2">
          <h1 className="font-philosopher text-white text-3xl mb-2">
            Jade Host
          </h1>
          <p className="text-white/40 font-manrope text-xs tracking-widest uppercase">
            Admin Dashboard
          </p>
        </div>
        <div className="relative border border-white/20 focus-within:border-[#EFCD62] transition-colors">
          <label className="absolute -top-2.5 left-3 bg-[#0B2C23] px-1 text-xs text-[#EFCD62] uppercase tracking-widest font-bold">
            Password
          </label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full bg-transparent px-4 py-3.5 text-white text-sm placeholder:text-white/30 focus:outline-none font-manrope"
            placeholder="Enter admin password"
            autoFocus
          />
        </div>
        {error && (
          <p className="flex items-center gap-2 text-red-400 text-sm font-manrope">
            <AlertTriangle className="w-4 h-4" /> {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !pw}
          className={`py-3.5 font-manrope font-bold text-sm tracking-widest uppercase transition-all ${loading || !pw ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-[#EFCD62] text-[#0B2C23] hover:bg-white"}`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "SIGN IN"
          )}
        </button>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Confirm dialog
───────────────────────────────────────────────────────────────────── */
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  danger = false,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="bg-[#1a1a1a] border border-white/10 p-6 max-w-sm w-full">
        <p className="text-white font-manrope text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-white/20 text-white/60 text-sm font-manrope font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-sm font-manrope font-bold tracking-widest uppercase transition-colors ${danger ? "bg-red-600 hover:bg-red-500 text-white" : "bg-[#EFCD62] text-[#0B2C23] hover:bg-white"}`}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Booking Row — expandable with actions
───────────────────────────────────────────────────────────────────── */
function BookingRow({
  b,
  password,
  onStatusChange,
  onDelete,
}: {
  b: Booking;
  password: string;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [confirm, setConfirm] = useState<null | {
    message: string;
    action: () => void;
    danger?: boolean;
  }>(null);

  const updateStatus = async (newStatus: string) => {
    setStatusLoading(true);
    const res = await fetch(`/api/bookings/${b.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    setStatusLoading(false);
    if (res.ok) onStatusChange(b.id, newStatus);
  };

  const deleteBooking = async () => {
    const res = await fetch(`/api/bookings/${b.id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    if (res.ok) onDelete(b.id);
  };

  const [localToday, setLocalToday] = useState("");
  useEffect(() => {
    setLocalToday(todayISO());
  }, []);
  const isToday = (dateStr: string) =>
    !!localToday && dateStr.split("T")[0] === localToday;

  return (
    <>
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          danger={confirm.danger}
          onConfirm={() => {
            confirm.action();
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
      <tr
        onClick={() => setOpen(!open)}
        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
      >
        <td className="py-3 px-4 text-sm font-manrope">
          <span className="font-manrope text-[#EFCD62] text-xs">
            {shortId(b.id)}
          </span>
        </td>
        <td className="py-3 px-4 text-sm font-manrope font-semibold text-white/90">
          {b.villa_name}
        </td>
        <td className="py-3 px-4 text-sm font-manrope">
          <div className="text-white/90">{b.full_name}</div>
          <div className="text-white/40 text-xs">{b.email}</div>
        </td>
        <td className="py-3 px-4 text-sm font-manrope text-white/70">
          <div className="flex items-center gap-1">
            {isToday(b.check_in) && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#EFCD62] shrink-0"
                title="Checking in today"
              />
            )}
            {fmtDate(b.check_in)}
          </div>
          <div className="text-white/40 text-xs">
            → {fmtDate(b.check_out)} · {nights(b.check_in, b.check_out)}N
          </div>
        </td>
        <td className="py-3 px-4 text-sm font-manrope font-bold text-white/90">
          {fmtRupees(b.total_price)}
        </td>
        <td className="py-3 px-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_STYLE[b.status] ?? STATUS_STYLE.pending}`}
          >
            {STATUS_ICON[b.status]}
            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
          </span>
        </td>
        <td className="py-3 px-4 text-white/30 text-xs font-manrope hidden md:table-cell">
          {fmtDate(b.created_at)}
        </td>
        <td className="py-3 px-4 text-white/30">
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </td>
      </tr>

      {open && (
        <tr className="border-b border-white/5 bg-white/[0.02]">
          <td colSpan={8} className="px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-manrope mb-5">
              <Detail
                icon={<Users className="w-4 h-4 text-[#EFCD62]" />}
                label="Guests"
                value={`${b.adults} Adults · ${b.children} Children · ${b.pets} Pets`}
              />
              <Detail
                icon={<Calendar className="w-4 h-4 text-[#EFCD62]" />}
                label="Booked on"
                value={fmtDateTime(b.created_at)}
              />
              <Detail
                icon={<IndianRupee className="w-4 h-4 text-[#EFCD62]" />}
                label="Price breakdown"
                value={`Base ${fmtRupees(b.base_price)} · Add-ons ${fmtRupees(b.add_on_total)} · Tax ${fmtRupees(b.tax_amount)}`}
              />
              <Detail
                icon={<BedDouble className="w-4 h-4 text-[#EFCD62]" />}
                label="Stay"
                value={`${nights(b.check_in, b.check_out)} nights · ${fmtDate(b.check_in)} → ${fmtDate(b.check_out)}`}
              />
              {b.add_ons?.length > 0 && (
                <div className="col-span-2 md:col-span-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                    Add-ons
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {b.add_ons.map((a) => (
                      <span
                        key={a}
                        className="bg-[#EFCD62]/10 text-[#EFCD62] border border-[#EFCD62]/20 text-xs px-2.5 py-1 rounded-full"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {b.notes && (
                <div className="col-span-2 md:col-span-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                    Guest note
                  </p>
                  <p className="text-white/70 italic">"{b.notes}"</p>
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
              {/* Contact */}
              <a
                href={`tel:${b.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs font-manrope font-bold tracking-wide uppercase transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`mailto:${b.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs font-manrope font-bold tracking-wide uppercase transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </a>

              <div className="w-px h-6 bg-white/10" />

              {/* Status changes */}
              {b.status !== "confirmed" && (
                <button
                  disabled={statusLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm({
                      message: "Mark this booking as confirmed?",
                      action: () => updateStatus("confirmed"),
                    });
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-manrope font-bold tracking-wide uppercase transition-colors"
                >
                  {statusLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Confirm
                </button>
              )}
              {b.status !== "pending" && (
                <button
                  disabled={statusLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm({
                      message: "Mark this booking as pending?",
                      action: () => updateStatus("pending"),
                    });
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-xs font-manrope font-bold tracking-wide uppercase transition-colors"
                >
                  <Clock className="w-3.5 h-3.5" /> Pending
                </button>
              )}
              {b.status !== "cancelled" && (
                <button
                  disabled={statusLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm({
                      message:
                        "Cancel this booking? The dates will become available again.",
                      action: () => updateStatus("cancelled"),
                    });
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-manrope font-bold tracking-wide uppercase transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              )}

              <div className="w-px h-6 bg-white/10" />

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirm({
                    message:
                      "Permanently delete this booking? This cannot be undone.",
                    danger: true,
                    action: deleteBooking,
                  });
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/30 text-xs font-manrope font-bold tracking-wide uppercase transition-colors ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2 items-start">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-white/70 text-sm">{value}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Sortable header cell
───────────────────────────────────────────────────────────────────── */
function SortTh({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="py-3 px-4 text-white/40 text-xs font-manrope uppercase tracking-widest font-bold cursor-pointer hover:text-white/70 transition-colors select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          dir === "asc" ? (
            <ChevronUp className="w-3 h-3 text-[#EFCD62]" />
          ) : (
            <ChevronDown className="w-3 h-3 text-[#EFCD62]" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </th>
  );
}

const PAGE_SIZE = 15;

/* ─────────────────────────────────────────────────────────────────────
   Dashboard
───────────────────────────────────────────────────────────────────── */
function Dashboard({
  password,
  onLogout,
}: {
  password: string;
  onLogout: () => void;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  // Stable client-only "today" string — prevents server/client hydration mismatch
  const [todayStr, setTodayStr] = useState("");
  useEffect(() => {
    setTodayStr(todayISO());
  }, []);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [villaFilter, setVillaFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [page, setPage] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Derived: unique villa names for filter dropdown
  const villaNames = useMemo(() => {
    const seen = new Map<string, boolean>();
    bookings.forEach((b) => seen.set(b.villa_name, true));
    return Array.from(seen.keys()).sort();
  }, [bookings]);

  // Callbacks for row actions
  const handleStatusChange = useCallback((id: string, status: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: status as Booking["status"] } : b,
      ),
    );
  }, []);
  const handleDelete = useCallback((id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Sort handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  // Filter + sort pipeline
  const filtered = useMemo(() => {
    let arr = bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (villaFilter !== "all" && b.villa_name !== villaFilter) return false;
      if (dateFrom && b.check_in.split("T")[0] < dateFrom) return false;
      if (dateTo && b.check_in.split("T")[0] > dateTo) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.full_name.toLowerCase().includes(q) &&
          !b.villa_name.toLowerCase().includes(q) &&
          !b.email.toLowerCase().includes(q) &&
          !b.phone.includes(q) &&
          !b.id.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    arr.sort((a, b) => {
      let av: string | number = a[sortKey] as string;
      let bv: string | number = b[sortKey] as string;
      if (sortKey === "total_price") {
        av = Number(a.total_price);
        bv = Number(b.total_price);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [
    bookings,
    statusFilter,
    villaFilter,
    dateFrom,
    dateTo,
    search,
    sortKey,
    sortDir,
  ]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats — use todayStr (client-only, empty string on server → no false matches)
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const revenue = confirmed.reduce((s, b) => s + Number(b.total_price), 0);
  const todayCheckIns = todayStr
    ? bookings.filter(
        (b) =>
          b.check_in.split("T")[0] === todayStr && b.status === "confirmed",
      )
    : [];
  const todayCheckOuts = todayStr
    ? bookings.filter(
        (b) =>
          b.check_out.split("T")[0] === todayStr && b.status === "confirmed",
      )
    : [];
  const thisMonthRevenue = todayStr
    ? confirmed
        .filter((b) => b.created_at.startsWith(todayStr.slice(0, 7)))
        .reduce((s, b) => s + Number(b.total_price), 0)
    : 0;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setVillaFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };
  const hasFilters =
    search ||
    statusFilter !== "all" ||
    villaFilter !== "all" ||
    dateFrom ||
    dateTo;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Top bar */}
      <div className="bg-[#0B2C23] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="font-philosopher text-white text-xl leading-tight">
            Jade Host
          </h1>
          <p className="text-white/40 text-xs font-manrope tracking-widest uppercase">
            Admin Dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-xs font-manrope font-bold tracking-widest uppercase transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-manrope transition-colors px-2 py-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-manrope transition-colors px-2 py-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <StatCard
            icon={<Home className="w-5 h-5" />}
            label="Total Bookings"
            value={bookings.length}
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            label="Confirmed"
            value={confirmed.length}
            color="emerald"
          />
          <StatCard
            icon={<XCircle className="w-5 h-5 text-red-400" />}
            label="Cancelled"
            value={bookings.filter((b) => b.status === "cancelled").length}
            color="red"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-[#EFCD62]" />}
            label="Total Revenue"
            value={fmtRupees(revenue)}
          />
          <StatCard
            icon={<Star className="w-5 h-5 text-[#EFCD62]" />}
            label="This Month"
            value={fmtRupees(thisMonthRevenue)}
          />
          <StatCard
            icon={<IndianRupee className="w-5 h-5" />}
            label="Avg Booking"
            value={
              confirmed.length
                ? fmtRupees(Math.round(revenue / confirmed.length))
                : "—"
            }
          />
        </div>

        {/* ── Today's activity ── */}
        {(todayCheckIns.length > 0 || todayCheckOuts.length > 0) && (
          <div className="grid md:grid-cols-2 gap-3">
            {todayCheckIns.length > 0 && (
              <ActivityCard
                title="Today's Check-ins"
                color="emerald"
                items={todayCheckIns}
              />
            )}
            {todayCheckOuts.length > 0 && (
              <ActivityCard
                title="Today's Check-outs"
                color="amber"
                items={todayCheckOuts}
              />
            )}
          </div>
        )}

        {/* ── Filters ── */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search name, villa, email, phone, ID…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-white/5 border border-white/10 focus:border-[#EFCD62] pl-10 pr-4 py-2.5 text-white text-sm font-manrope placeholder:text-white/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Status */}
            <FilterSelect
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </FilterSelect>

            {/* Villa */}
            <FilterSelect
              value={villaFilter}
              onChange={(v) => {
                setVillaFilter(v);
                setPage(1);
              }}
            >
              <option value="all">All Villas</option>
              {villaNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </FilterSelect>
          </div>

          {/* Date range */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-white/40 text-xs font-manrope uppercase tracking-widest">
              <Calendar className="w-4 h-4" /> Check-in range:
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="bg-white/5 border border-white/10 focus:border-[#EFCD62] px-3 py-2 text-white text-sm font-manrope focus:outline-none transition-colors"
            />
            <span className="text-white/30 text-sm">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="bg-white/5 border border-white/10 focus:border-[#EFCD62] px-3 py-2 text-white text-sm font-manrope focus:outline-none transition-colors"
            />
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-white/40 hover:text-white text-xs font-manrope uppercase tracking-widest underline transition-colors"
              >
                Clear all
              </button>
            )}
            <span className="text-white/30 text-xs font-manrope ml-auto">
              {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#EFCD62] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30 font-manrope">
            No bookings match your filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-white/40 text-xs font-manrope uppercase tracking-widest font-bold">
                      ID
                    </th>
                    <SortTh
                      label="Villa"
                      sortKey="villa_name"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                    <SortTh
                      label="Guest"
                      sortKey="full_name"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                    <SortTh
                      label="Check-in"
                      sortKey="check_in"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                    <SortTh
                      label="Amount"
                      sortKey="total_price"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-white/40 text-xs font-manrope uppercase tracking-widest font-bold">
                      Status
                    </th>
                    <SortTh
                      label="Booked On"
                      sortKey="created_at"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((b) => (
                    <BookingRow
                      key={b.id}
                      b={b}
                      password={password}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-white/40 text-xs font-manrope">
                  Page {page} of {totalPages} · {filtered.length} bookings
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`w-8 h-8 flex items-center justify-center border transition-colors ${page === 1 ? "border-white/10 text-white/20 cursor-not-allowed" : "border-white/20 text-white/60 hover:text-white hover:border-white/40"}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                    )
                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1)
                        acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="text-white/30 text-xs px-1"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`w-8 h-8 flex items-center justify-center border text-xs font-manrope font-bold transition-colors ${page === p ? "bg-[#EFCD62] text-[#0B2C23] border-[#EFCD62]" : "border-white/20 text-white/60 hover:text-white hover:border-white/40"}`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`w-8 h-8 flex items-center justify-center border transition-colors ${page === totalPages ? "border-white/10 text-white/20 cursor-not-allowed" : "border-white/20 text-white/60 hover:text-white hover:border-white/40"}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Small reusable pieces
───────────────────────────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: "emerald" | "red";
}) {
  return (
    <div
      className={`bg-white/5 border p-4 rounded-sm ${color === "emerald" ? "border-emerald-500/20" : color === "red" ? "border-red-500/20" : "border-white/10"}`}
    >
      <div className="flex items-center gap-2 mb-2 text-white/40">{icon}</div>
      <p className="text-white/40 text-xs font-manrope uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-white font-philosopher text-xl leading-tight">
        {value}
      </p>
    </div>
  );
}

function ActivityCard({
  title,
  color,
  items,
}: {
  title: string;
  color: "emerald" | "amber";
  items: Booking[];
}) {
  const border =
    color === "emerald" ? "border-emerald-500/20" : "border-amber-500/20";
  const text = color === "emerald" ? "text-emerald-400" : "text-amber-400";
  return (
    <div className={`bg-white/5 border ${border} p-4 rounded-sm`}>
      <p
        className={`text-xs font-manrope font-bold uppercase tracking-widest ${text} mb-3`}
      >
        {title}
      </p>
      <div className="space-y-2">
        {items.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between text-sm font-manrope"
          >
            <div>
              <span className="text-white/90 font-semibold">{b.full_name}</span>
              <span className="text-white/40 ml-2">· {b.villa_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <a href={`tel:${b.phone}`} className={`${text} hover:opacity-80`}>
                <Phone className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${b.email}`}
                className={`${text} hover:opacity-80`}
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/5 border border-white/10 text-white text-sm font-manrope px-4 py-2.5 focus:outline-none focus:border-[#EFCD62] transition-colors appearance-none"
    >
      {children}
    </select>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Page root
───────────────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);

  if (!password) return <LoginScreen onLogin={setPassword} />;
  return <Dashboard password={password} onLogout={() => setPassword(null)} />;
}
