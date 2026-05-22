"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  ),
});

export default function RouteMapClient({ geojson, startLat, startLng }) {
  const [navMode, setNavMode] = useState(false);
  const containerRef = useRef(null);
  const hasPath = geojson?.coordinates?.length > 1;

  useEffect(() => {
    function onFullscreenChange() {
      if (!document.fullscreenElement) setNavMode(false);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const handler = () => {
      setNavMode(true);
      containerRef.current?.requestFullscreen?.().catch(() => {});
    };
    document.addEventListener("route:start-navigation", handler);
    return () => document.removeEventListener("route:start-navigation", handler);
  }, []);

  async function exitNavigation() {
    setNavMode(false);
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch {}
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full relative bg-neutral-900">
      <RouteMap
        geojson={geojson}
        startLat={startLat}
        startLng={startLng}
        navigationMode={navMode}
      />

      {/* No-path overlay */}
      {!hasPath && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
          <div className="bg-neutral-950/80 backdrop-blur-sm border border-white/8 rounded-xl px-4 py-3 text-center">
            <Icon icon="mdi:map-clock-outline" className="w-6 h-6 text-neutral-500 mx-auto mb-1" />
            <p className="text-neutral-500 text-xs">Peta rute belum tersedia</p>
          </div>
        </div>
      )}

      {/* Back button — hidden in nav mode */}
      {!navMode && (
        <div className="absolute top-4 left-4 z-1000">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-950/90 hover:bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white text-sm font-medium transition-colors duration-150 backdrop-blur-sm"
          >
            <Icon icon="mdi:arrow-left" className="w-4 h-4" />
            Kembali
          </a>
        </div>
      )}

      {/* Exit navigation */}
      {navMode && (
        <div className="absolute top-4 left-4 z-1000">
          <button
            onClick={exitNavigation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-950/90 hover:bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white text-sm font-medium transition-colors duration-150 backdrop-blur-sm"
          >
            <Icon icon="mdi:close" className="w-4 h-4" />
            Keluar Navigasi
          </button>
        </div>
      )}
    </div>
  );
}
