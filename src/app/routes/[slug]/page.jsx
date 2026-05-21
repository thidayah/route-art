import { notFound } from "next/navigation";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteMapClient from "@/components/RouteMapClient";

const categoryLabels = {
  hewan: "Hewan",
  bunga: "Bunga",
  karakter: "Karakter",
  objek: "Objek",
  default: "Umum",
};

const categoryIcons = {
  hewan: "mdi:paw",
  bunga: "mdi:flower",
  karakter: "mdi:account-star",
  objek: "mdi:shape",
  default: "mdi:map-marker-path",
};

async function getRoute(slug) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("ra_routes")
    .select(
      "id, name, slug, city, distance_km, category, thumbnail_url, gpx_file_url, geojson, start_lat, start_lng"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error || !data) return null;
  return data;
}

export async function generateStaticParams() {
  if (!supabase) return [];
  const { data } = await supabase
    .from("ra_routes")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const route = await getRoute(slug);
  if (!route) {
    return { title: "Rute Tidak Ditemukan — RouteArt" };
  }
  const description = `Rute lari artistik ${route.name} di ${route.city}. Jarak ${route.distance_km} km.`;
  return {
    title: `${route.name} — RouteArt`,
    description,
    openGraph: {
      title: `${route.name} — RouteArt`,
      description,
      type: "article",
      locale: "id_ID",
      images: route.thumbnail_url ? [{ url: route.thumbnail_url }] : [],
    },
  };
}

export default async function RouteDetailPage({ params }) {
  const { slug } = await params;
  const route = await getRoute(slug);
  if (!route) notFound();

  const label = categoryLabels[route.category] ?? categoryLabels.default;
  const iconName = categoryIcons[route.category] ?? categoryIcons.default;
  const isShort = route.distance_km < 10;

  const mapsUrl =
    route.start_lat && route.start_lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${route.start_lat},${route.start_lng}`
      : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 pt-16">
        {/* Map */}
        <div className="h-[50vh] sm:h-[60vh] w-full bg-neutral-900 relative">
          <RouteMapClient
            geojson={route.geojson}
            startLat={route.start_lat}
            startLng={route.start_lng}
          />

          {/* No-path overlay — shown when route has no coordinates yet */}
          {!(route.geojson?.coordinates?.length > 1) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-500">
              <div className="bg-neutral-950/80 backdrop-blur-sm border border-white/8 rounded-xl px-4 py-3 text-center">
                <Icon
                  icon="mdi:map-clock-outline"
                  className="w-6 h-6 text-neutral-500 mx-auto mb-1"
                />
                <p className="text-neutral-500 text-xs">
                  Peta rute belum tersedia
                </p>
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="absolute top-4 left-4 z-1000">
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-950/90 hover:bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white text-sm font-medium transition-colors duration-150 backdrop-blur-sm"
            >
              <Icon icon="mdi:arrow-left" className="w-4 h-4" />
              Kembali
            </a>
          </div>
        </div>

        {/* Detail card */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 pb-24">
          <div className="bg-neutral-900 rounded-2xl border border-white/8 p-6 sm:p-8">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/6 border border-white/8 text-neutral-400 text-[11px] font-medium uppercase tracking-widest">
                <Icon icon={iconName} className="w-3.5 h-3.5" />
                {label}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                  isShort
                    ? "bg-accent text-neutral-950"
                    : "bg-neutral-800 text-accent border border-accent/25"
                }`}
              >
                {route.distance_km} KM
              </span>
            </div>

            {/* Name + city */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
              {route.name}
            </h1>
            <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-8">
              <Icon icon="mdi:map-marker" className="w-4 h-4 shrink-0" />
              {route.city}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-neutral-800/50 rounded-xl border border-white/4">
              <div className="text-center">
                <div className="text-xl font-bold text-accent tabular-nums">
                  {route.distance_km}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                  Kilometer
                </div>
              </div>
              <div className="text-center border-x border-white/6">
                <div className="text-xl font-bold text-white capitalize">
                  {label}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                  Kategori
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white truncate">
                  {route.city.split(" ")[0]}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                  Kota
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-semibold text-sm transition-colors duration-150 active:scale-95"
                >
                  <Icon icon="mdi:navigation" className="w-4 h-4" />
                  Mulai Navigasi
                </a>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl bg-neutral-800 text-neutral-600 text-sm border border-white/4 cursor-not-allowed">
                  <Icon icon="mdi:navigation-outline" className="w-4 h-4" />
                  Koordinat Belum Tersedia
                </div>
              )}

              {route.gpx_file_url && (
                <a
                  href={route.gpx_file_url}
                  download
                  className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm border border-white/8 hover:border-white/12 transition-colors duration-150 active:scale-95"
                >
                  <Icon icon="mdi:download" className="w-4 h-4" />
                  Unduh GPX
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
