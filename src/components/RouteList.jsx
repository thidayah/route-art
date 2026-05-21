"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import RouteCard from "./RouteCard";

const SAMPLE_ROUTES = [
  {
    id: 1,
    name: "Kucing Tidur Senayan",
    city: "Jakarta Selatan",
    distance: 5.2,
    category: "hewan",
  },
  {
    id: 2,
    name: "Naga Melingkar Braga",
    city: "Bandung",
    distance: 12.5,
    category: "hewan",
  },
  {
    id: 3,
    name: "Bunga Mawar Sudirman",
    city: "Jakarta Pusat",
    distance: 7.8,
    category: "bunga",
  },
  {
    id: 4,
    name: "Wayang Arjuna Malioboro",
    city: "Yogyakarta",
    distance: 9.1,
    category: "karakter",
  },
  {
    id: 5,
    name: "Bintang Lima Dago",
    city: "Bandung",
    distance: 6.3,
    category: "objek",
  },
  {
    id: 6,
    name: "Penyu Pantai Kuta",
    city: "Bali",
    distance: 14.7,
    category: "hewan",
  },
];

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "short", label: "< 10 KM" },
  { id: "long", label: "> 10 KM" },
  { id: "nearest", label: "Terdekat" },
];

export default function RouteList() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredRoutes = SAMPLE_ROUTES.filter((route) => {
    const matchesSearch =
      route.name.toLowerCase().includes(search.toLowerCase()) ||
      route.city.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "short" && route.distance < 10) ||
      (activeFilter === "long" && route.distance >= 10) ||
      activeFilter === "nearest";

    return matchesSearch && matchesFilter;
  });

  const visibleRoutes = filteredRoutes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRoutes.length;

  return (
    <section
      id="rute"
      className="py-24 px-4 sm:px-6 bg-neutral-950"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="text-lime-400/80 text-[11px] font-semibold uppercase tracking-widest">
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
          {/* Search */}
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
              className="w-full pl-10 pr-4 py-3 h-[44px] bg-neutral-900 border border-white/8 hover:border-white/12 focus:border-lime-400/40 focus:ring-2 focus:ring-lime-400/10 rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-colors duration-150"
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

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 shrink-0">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border ${
                  activeFilter === filter.id
                    ? "bg-lime-400 text-neutral-950 border-lime-400"
                    : "bg-transparent text-neutral-500 border-white/8 hover:border-white/16 hover:text-neutral-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Route count */}
        {(search || activeFilter !== "all") && (
          <p className="text-neutral-600 text-xs mb-6">
            Menampilkan{" "}
            <span className="text-lime-400 font-semibold">
              {filteredRoutes.length}
            </span>{" "}
            rute
          </p>
        )}

        {/* Route Grid */}
        {filteredRoutes.length === 0 ? (
          <div className="text-center py-20">
            <Icon icon="mdi:map-search" className="w-10 h-10 mx-auto mb-4 text-neutral-700" />
            <p className="text-sm font-semibold text-neutral-500">
              Rute tidak ditemukan
            </p>
            <p className="text-xs text-neutral-600 mt-1">Coba kata kunci atau filter lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleRoutes.map((route) => (
              <RouteCard key={route.id} {...route} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + 6)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-sm font-semibold border border-neutral-800 hover:border-neutral-700 transition-all duration-200 active:scale-95"
            >
              <Icon icon="mdi:chevron-down" className="w-4 h-4" />
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
