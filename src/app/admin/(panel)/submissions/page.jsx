"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "Semua" },
];

const STATUS_BADGE = {
  pending: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  approved: "bg-green-500/10 border-green-500/20 text-green-400",
  rejected: "bg-red-500/10 border-red-500/20 text-red-400",
};

const STATUS_ICON = {
  pending: "mdi:clock-outline",
  approved: "mdi:check-circle-outline",
  rejected: "mdi:close-circle-outline",
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setSelected(new Set());

    let query = supabase
      .from("ra_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") query = query.eq("status", filter);

    const { data, error: err } = await query;
    if (err) setError(err.message);
    else setSubmissions(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id, status) {
    setUpdating(id);
    const { error: err } = await supabase
      .from("ra_submissions")
      .update({ status })
      .eq("id", id);
    if (!err) {
      setSubmissions((prev) =>
        filter === "all"
          ? prev.map((s) => (s.id === id ? { ...s, status } : s))
          : prev.filter((s) => s.id !== id)
      );
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    setUpdating(null);
  }

  async function bulkUpdate(status) {
    if (selected.size === 0) return;
    setBulkUpdating(true);
    const ids = [...selected];
    const { error: err } = await supabase
      .from("ra_submissions")
      .update({ status })
      .in("id", ids);
    if (!err) {
      setSubmissions((prev) =>
        filter === "all"
          ? prev.map((s) => (ids.includes(s.id) ? { ...s, status } : s))
          : prev.filter((s) => !ids.includes(s.id))
      );
      setSelected(new Set());
    }
    setBulkUpdating(false);
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === submissions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(submissions.map((s) => s.id)));
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Submissions</h1>
        <p className="text-neutral-500 text-sm mt-0.5">
          Kelola kiriman rute dari pengguna
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-neutral-900 rounded-xl border border-white/6 w-fit">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
              filter === value
                ? "bg-accent text-neutral-950"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-2.5 bg-accent/8 border border-accent/15 rounded-xl">
          <span className="text-accent text-sm font-medium">
            {selected.size} dipilih
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => bulkUpdate("approved")}
              disabled={bulkUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 transition-colors disabled:opacity-50"
            >
              <Icon icon="mdi:check-all" className="w-3.5 h-3.5" />
              Setujui Semua
            </button>
            <button
              onClick={() => bulkUpdate("rejected")}
              disabled={bulkUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors disabled:opacity-50"
            >
              <Icon icon="mdi:close" className="w-3.5 h-3.5" />
              Tolak Semua
            </button>
          </div>
        </div>
      )}

      {/* States */}
      {!supabase && (
        <div className="text-neutral-500 text-sm py-12 text-center">
          Supabase belum dikonfigurasi
        </div>
      )}
      {supabase && loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}
      {supabase && !loading && error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <Icon icon="mdi:alert-circle" className="w-4 h-4 shrink-0" />
          {error}
          <button
            onClick={load}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      )}
      {supabase && !loading && !error && submissions.length === 0 && (
        <div className="py-16 text-center">
          <Icon
            icon="mdi:inbox-outline"
            className="w-10 h-10 text-neutral-700 mx-auto mb-3"
          />
          <p className="text-neutral-600 text-sm">Tidak ada submission</p>
        </div>
      )}

      {/* List */}
      {supabase && !loading && !error && submissions.length > 0 && (
        <div className="space-y-2">
          {/* Select all row */}
          <div className="flex items-center gap-3 px-4 py-1.5">
            <input
              type="checkbox"
              checked={
                selected.size === submissions.length && submissions.length > 0
              }
              onChange={toggleAll}
              className="w-4 h-4 rounded border-white/20 bg-neutral-800 accent-accent cursor-pointer"
            />
            <span className="text-xs text-neutral-600">
              Pilih semua ({submissions.length})
            </span>
          </div>

          {submissions.map((s) => {
            const badgeClass =
              STATUS_BADGE[s.status] ?? STATUS_BADGE.pending;
            const iconName = STATUS_ICON[s.status] ?? STATUS_ICON.pending;
            return (
              <div
                key={s.id}
                className={`bg-neutral-900 rounded-xl border transition-colors p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                  selected.has(s.id)
                    ? "border-accent/20"
                    : "border-white/6"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(s.id)}
                  onChange={() => toggleSelect(s.id)}
                  className="w-4 h-4 rounded border-white/20 bg-neutral-800 accent-accent cursor-pointer shrink-0 self-start sm:self-center"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-medium text-white text-sm">
                      {s.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass}`}
                    >
                      <Icon icon={iconName} className="w-3 h-3" />
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Icon icon="mdi:map-marker" className="w-3.5 h-3.5" />
                      {s.location}
                    </span>
                    <a
                      href={s.strava_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-accent hover:underline"
                    >
                      <Icon icon="mdi:open-in-new" className="w-3.5 h-3.5" />
                      Lihat Strava
                    </a>
                    <span>
                      {new Date(s.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 flex-wrap">
                  {s.status === "pending" && (
                    <a
                      href={`/admin/routes/new?name=${encodeURIComponent(s.name)}&source_url=${encodeURIComponent(s.strava_url)}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium border border-accent/20 transition-colors"
                    >
                      <Icon icon="mdi:plus" className="w-3.5 h-3.5" />
                      Buat Rute
                    </a>
                  )}
                  {s.status !== "approved" && (
                    <button
                      onClick={() => updateStatus(s.id, "approved")}
                      disabled={updating === s.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 transition-colors disabled:opacity-50"
                    >
                      <Icon icon="mdi:check" className="w-3.5 h-3.5" />
                      Setujui
                    </button>
                  )}
                  {s.status !== "rejected" && (
                    <button
                      onClick={() => updateStatus(s.id, "rejected")}
                      disabled={updating === s.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                  )}
                  {s.status !== "pending" && (
                    <button
                      onClick={() => updateStatus(s.id, "pending")}
                      disabled={updating === s.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-medium border border-white/8 transition-colors disabled:opacity-50"
                    >
                      <Icon icon="mdi:restore" className="w-3.5 h-3.5" />
                      Pending
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
