"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import RouteCard from "./RouteCard";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 6;

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "short", label: "< 10 KM" },
  { id: "long", label: "> 10 KM" },
  { id: "nearest", label: "Terdekat" },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-neutral-900 rounded-2xl overflow-hidden border border-white/6 animate-pulse">
      <div className="h-48 bg-neutral-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-800 rounded w-1/2" />
        <div className="h-8 bg-neutral-800 rounded-lg mt-auto" />
      </div>
    </div>
  );
}

export default function RouteList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [routes, setRoutes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  const fetchRoutes = useCallback(
    async (currentPage, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        if (!supabase) throw new Error("Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local");

        let query = supabase
          .from("ra_routes")
          .select(
            "id, name, slug, city, distance_km, category, thumbnail_url",
            { count: "exact" }
          )
          .eq("status", "published");

        if (debouncedSearch) {
          query = query.or(
            `name.ilike.%${debouncedSearch}%,city.ilike.%${debouncedSearch}%`
          );
        }

        if (activeFilter === "short") query = query.lt("distance_km", 10);
        else if (activeFilter === "long") query = query.gte("distance_km", 10);

        if (activeFilter === "nearest") {
          query = query.order("distance_km", { ascending: true });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        query = query.range(
          currentPage * PAGE_SIZE,
          (currentPage + 1) * PAGE_SIZE - 1
        );

        const { data, count, error: sbError } = await query;
        if (sbError) throw sbError;

        const mapped = (data ?? []).map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          city: r.city,
          distance: r.distance_km,
          category: r.category ?? "default",
          thumbnailUrl: r.thumbnail_url ?? null,
        }));

        setRoutes((prev) => (append ? [...prev, ...mapped] : mapped));
        setTotal(count ?? 0);
      } catch (err) {
        setError(err?.message ?? "Gagal memuat rute. Periksa koneksi Supabase.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, activeFilter]
  );

  useEffect(() => {
    setPage(0);
    fetchRoutes(0, false);
  }, [fetchRoutes]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchRoutes(next, true);
  };

  const hasMore = routes.length < total;

  return (
    <section id="rute" className="py-24 px-4 sm:px-6 bg-neutral-950">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="text-accent/80 text-[11px] font-semibold uppercase tracking-widest">
            Jelajahi
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3 tracking-tight">
            Rute Pilihan
          </h2>
          <p className="text-neutral-500 text-sm max-w-md leading-[1.6]">
            Rute lari kreatif berbentuk karya seni yang tersebar di berbagai
            kota di Indonesia.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Icon
              icon="mdi:magnify"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
            />
            <input
              type="text"
              placeholder="Cari rute atau kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 h-[44px] bg-neutral-900 border border-white/8 hover:border-white/12 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-colors duration-150"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors"
              >
                <Icon icon="mdi:close-circle" className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 shrink-0">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border ${
                  activeFilter === f.id
                    ? "bg-accent text-neutral-950 border-accent"
                    : "bg-transparent text-neutral-500 border-white/8 hover:border-white/16 hover:text-neutral-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        {!loading && (search || activeFilter !== "all") && (
          <p className="text-neutral-600 text-xs mb-6">
            Menampilkan{" "}
            <span className="text-accent font-semibold">{total}</span> rute
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <Icon
              icon="mdi:alert-circle-outline"
              className="w-10 h-10 mx-auto mb-3 text-red-500/60"
            />
            <p className="text-sm font-semibold text-neutral-500">{error}</p>
            <button
              onClick={() => fetchRoutes(0, false)}
              className="mt-4 text-xs text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Route grid */}
        {!loading && !error && routes.length === 0 && (
          <div className="text-center py-20">
            <Icon
              icon="mdi:map-search"
              className="w-10 h-10 mx-auto mb-4 text-neutral-700"
            />
            <p className="text-sm font-semibold text-neutral-500">
              Rute tidak ditemukan
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              Coba kata kunci atau filter lain
            </p>
          </div>
        )}

        {!loading && !error && routes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => (
              <RouteCard key={route.id} {...route} />
            ))}
          </div>
        )}

        {/* Load more */}
        {!loading && !error && hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-sm font-semibold border border-white/8 hover:border-white/12 transition-colors duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  Memuat...
                </>
              ) : (
                <>
                  <Icon icon="mdi:chevron-down" className="w-4 h-4" />
                  Muat Lebih Banyak
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
