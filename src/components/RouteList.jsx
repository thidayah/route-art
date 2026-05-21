"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import RouteCard from "./RouteCard";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 6;
const MAX_KM = 50;

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "hewan", label: "Hewan" },
  { id: "bunga", label: "Bunga" },
  { id: "karakter", label: "Karakter" },
  { id: "objek", label: "Objek" },
  { id: "default", label: "Umum" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Terbaru" },
  { id: "shortest", label: "Terpendek" },
  { id: "longest", label: "Terpanjang" },
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

function RangeSlider({ minVal, maxVal, maxRange, onChange }) {
  const minPct = (minVal / maxRange) * 100;
  const maxPct = (maxVal / maxRange) * 100;

  return (
    <div className="relative flex items-center h-5 select-none">
      <div className="absolute inset-x-0 h-1 bg-neutral-700 rounded-full" />
      <div
        className="absolute h-1 bg-accent rounded-full"
        style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
      />
      <input
        type="range"
        min={0}
        max={maxRange}
        step={1}
        value={minVal}
        onChange={(e) => {
          const val = Math.min(Number(e.target.value), maxVal - 1);
          onChange([val, maxVal]);
        }}
        className="absolute w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: minVal > maxRange * 0.9 ? 5 : 3 }}
      />
      <input
        type="range"
        min={0}
        max={maxRange}
        step={1}
        value={maxVal}
        onChange={(e) => {
          const val = Math.max(Number(e.target.value), minVal + 1);
          onChange([minVal, val]);
        }}
        className="absolute w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: 4 }}
      />
      <div
        className="absolute w-3.5 h-3.5 bg-accent rounded-full border-2 border-neutral-950 pointer-events-none"
        style={{ left: `calc(${minPct}% - 7px)` }}
      />
      <div
        className="absolute w-3.5 h-3.5 bg-accent rounded-full border-2 border-neutral-950 pointer-events-none"
        style={{ left: `calc(${maxPct}% - 7px)` }}
      />
    </div>
  );
}

export default function RouteList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [distanceRange, setDistanceRange] = useState([
    Number(searchParams.get("min") ?? 0),
    Number(searchParams.get("max") ?? MAX_KM),
  ]);
  const [debouncedRange, setDebouncedRange] = useState([
    Number(searchParams.get("min") ?? 0),
    Number(searchParams.get("max") ?? MAX_KM),
  ]);
  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");

  const [routes, setRoutes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);

  const sentinelRef = useRef(null);
  const searchTimer = useRef(null);
  const rangeTimer = useRef(null);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => {
    clearTimeout(rangeTimer.current);
    rangeTimer.current = setTimeout(() => setDebouncedRange(distanceRange), 400);
    return () => clearTimeout(rangeTimer.current);
  }, [distanceRange]);

  // Sync URL when debounced filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (category !== "all") params.set("category", category);
    if (city) params.set("city", city);
    if (debouncedRange[0] > 0) params.set("min", String(debouncedRange[0]));
    if (debouncedRange[1] < MAX_KM) params.set("max", String(debouncedRange[1]));
    if (sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }, [debouncedSearch, category, city, debouncedRange, sort, pathname]);

  // Fetch distinct cities once
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("ra_routes")
      .select("city")
      .eq("status", "published")
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map((r) => r.city).filter(Boolean))].sort();
          setCities(unique);
        }
      });
  }, []);

  const fetchRoutes = useCallback(
    async (currentPage, append = false) => {
      if (append) setLoadingMore(true);
      else {
        setLoading(true);
        setError(null);
      }

      try {
        if (!supabase) {
          throw new Error(
            "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
          );
        }

        let query = supabase
          .from("ra_routes")
          .select("id, name, slug, city, distance_km, category, thumbnail_url", {
            count: "exact",
          })
          .eq("status", "published");

        if (debouncedSearch) {
          query = query.or(
            `name.ilike.%${debouncedSearch}%,city.ilike.%${debouncedSearch}%`
          );
        }
        if (category !== "all") query = query.eq("category", category);
        if (city) query = query.eq("city", city);
        if (debouncedRange[0] > 0) query = query.gte("distance_km", debouncedRange[0]);
        if (debouncedRange[1] < MAX_KM) query = query.lte("distance_km", debouncedRange[1]);

        if (sort === "shortest") query = query.order("distance_km", { ascending: true });
        else if (sort === "longest") query = query.order("distance_km", { ascending: false });
        else query = query.order("created_at", { ascending: false });

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
        setError(err?.message ?? "Gagal memuat rute.");
        if (!append) setRoutes([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, category, city, debouncedRange, sort]
  );

  useEffect(() => {
    setPage(0);
    fetchRoutes(0, false);
  }, [fetchRoutes]);

  const hasMore = routes.length < total;

  const loadMore = useCallback(() => {
    if (loadingMore || loading || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchRoutes(next, true);
  }, [loadingMore, loading, hasMore, page, fetchRoutes]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const hasActiveFilters =
    !!debouncedSearch ||
    category !== "all" ||
    !!city ||
    debouncedRange[0] > 0 ||
    debouncedRange[1] < MAX_KM ||
    sort !== "newest";

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setCategory("all");
    setCity("");
    setDistanceRange([0, MAX_KM]);
    setDebouncedRange([0, MAX_KM]);
    setSort("newest");
  }

  console.log({error});
  

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

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
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
              className="w-full pl-10 pr-10 py-3 h-[44px] bg-neutral-900 border border-white/8 hover:border-white/12 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-colors duration-150"
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

          <div className="relative shrink-0">
            <Icon
              icon="mdi:sort"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-[44px] pl-9 pr-8 bg-neutral-900 border border-white/8 hover:border-white/12 rounded-xl text-white text-sm outline-none appearance-none cursor-pointer transition-colors duration-150 focus:border-accent/40"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <Icon
              icon="mdi:chevron-down"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Category + City + Distance */}
        <div className="flex flex-wrap gap-2 items-center mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border ${
                category === c.id
                  ? "bg-accent text-neutral-950 border-accent"
                  : "bg-transparent text-neutral-500 border-white/8 hover:border-white/16 hover:text-neutral-300"
              }`}
            >
              {c.label}
            </button>
          ))}

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {cities.length > 0 && (
            <div className="relative">
              <Icon
                icon="mdi:map-marker"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none"
              />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`h-9 pl-7 pr-7 rounded-xl text-[11px] font-medium outline-none appearance-none cursor-pointer transition-colors duration-150 border ${
                  city
                    ? "bg-accent/10 border-accent/20 text-accent"
                    : "bg-neutral-900 border-white/8 text-neutral-500 hover:border-white/16 hover:text-neutral-300"
                }`}
              >
                <option value="">Semua Kota</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Icon
                icon="mdi:chevron-down"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none"
              />
            </div>
          )}

          <div
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border min-w-[190px] ${
              debouncedRange[0] > 0 || debouncedRange[1] < MAX_KM
                ? "bg-accent/10 border-accent/20"
                : "bg-neutral-900 border-white/8"
            }`}
          >
            <Icon
              icon="mdi:ruler"
              className="w-3.5 h-3.5 text-neutral-500 shrink-0"
            />
            <div className="flex-1">
              <RangeSlider
                minVal={distanceRange[0]}
                maxVal={distanceRange[1]}
                maxRange={MAX_KM}
                onChange={setDistanceRange}
              />
            </div>
            <span
              className={`text-[10px] shrink-0 tabular-nums w-[58px] text-right ${
                debouncedRange[0] > 0 || debouncedRange[1] < MAX_KM
                  ? "text-accent"
                  : "text-neutral-500"
              }`}
            >
              {distanceRange[0]}–{distanceRange[1]} km
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/8 text-[11px] text-neutral-500 hover:text-white hover:border-white/16 transition-colors"
            >
              <Icon icon="mdi:close" className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-neutral-600 text-xs mb-6">
            {hasActiveFilters ? (
              <>
                Menampilkan{" "}
                <span className="text-accent font-semibold">{total}</span> rute
              </>
            ) : (
              <>
                <span className="text-neutral-500 font-semibold">{total}</span>{" "}
                rute tersedia
              </>
            )}
          </p>
        )}

        {/* Error */}
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

        {/* Skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
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
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-xs text-accent hover:underline"
              >
                Reset semua filter
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && routes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => (
              <RouteCard key={route.id} {...route} />
            ))}
          </div>
        )}

        {/* Loading more */}
        {loadingMore && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {/* End of results */}
        {!loading && !loadingMore && !hasMore && routes.length > 0 && (
          <p className="text-center text-xs text-neutral-700 mt-6">
            Semua rute telah ditampilkan
          </p>
        )}
      </div>
    </section>
  );
}
