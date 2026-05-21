"use client";

import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  ),
});

export default function RouteMapClient({ geojson, startLat, startLng }) {
  return <RouteMap geojson={geojson} startLat={startLat} startLng={startLng} />;
}
