"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

const CATEGORY_LABEL = {
  hewan: "Hewan",
  bunga: "Bunga",
  karakter: "Karakter",
  objek: "Objek",
  default: "Umum",
};

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("ra_routes")
      .select("id, name, slug, city, distance_km, category, status, created_at")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setRoutes(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus(route) {
    const newStatus = route.status === "published" ? "draft" : "published";
    setToggling(route.id);
    const { error: err } = await supabase
      .from("ra_routes")
      .update({ status: newStatus })
      .eq("id", route.id);
    if (!err) {
      setRoutes((prev) =>
        prev.map((r) => (r.id === route.id ? { ...r, status: newStatus } : r))
      );
    }
    setToggling(null);
  }

  async function deleteRoute(id, name) {
    if (
      !confirm(`Hapus rute "${name}"? Tindakan ini tidak dapat dibatalkan.`)
    )
      return;
    setDeleting(id);
    const { error: err } = await supabase
      .from("ra_routes")
      .delete()
      .eq("id", id);
    if (!err) setRoutes((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Routes</h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            Kelola semua rute lari artistik
          </p>
        </div>
        <Link
          href="/admin/routes/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-semibold text-sm transition-colors duration-150 active:scale-95"
        >
          <Icon icon="mdi:plus" className="w-4 h-4" />
          Rute Baru
        </Link>
      </div>

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
      {supabase && !loading && !error && routes.length === 0 && (
        <div className="py-16 text-center">
          <Icon
            icon="mdi:map-search-outline"
            className="w-10 h-10 text-neutral-700 mx-auto mb-3"
          />
          <p className="text-neutral-600 text-sm mb-4">Belum ada rute</p>
          <Link
            href="/admin/routes/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-semibold text-sm transition-colors"
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Tambah Rute Pertama
          </Link>
        </div>
      )}

      {/* List */}
      {supabase && !loading && !error && routes.length > 0 && (
        <div className="space-y-2">
          {routes.map((r) => (
            <div
              key={r.id}
              className="bg-neutral-900 rounded-xl border border-white/6 px-4 py-3 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-white text-sm truncate">
                    {r.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      r.status === "published"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-neutral-800 text-neutral-500 border-white/8"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:map-marker" className="w-3 h-3" />
                    {r.city}
                  </span>
                  <span>{r.distance_km} km</span>
                  <span>{CATEGORY_LABEL[r.category] ?? "Umum"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <button
                  onClick={() => toggleStatus(r)}
                  disabled={toggling === r.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
                    r.status === "published"
                      ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-white/8"
                      : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20"
                  }`}
                >
                  <Icon
                    icon={
                      toggling === r.id
                        ? "mdi:loading"
                        : r.status === "published"
                        ? "mdi:eye-off-outline"
                        : "mdi:eye-outline"
                    }
                    className={`w-3.5 h-3.5 ${toggling === r.id ? "animate-spin" : ""}`}
                  />
                  {r.status === "published" ? "Sembunyikan" : "Publikasikan"}
                </button>

                <Link
                  href={`/admin/routes/${r.id}/edit`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-white/8 transition-colors"
                >
                  <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
                  Edit
                </Link>

                <button
                  onClick={() => deleteRoute(r.id, r.name)}
                  disabled={deleting === r.id}
                  className="flex items-center gap-1 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50"
                  title="Hapus rute"
                >
                  <Icon
                    icon={
                      deleting === r.id
                        ? "mdi:loading"
                        : "mdi:delete-outline"
                    }
                    className={`w-4 h-4 ${deleting === r.id ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
