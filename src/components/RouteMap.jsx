"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "@iconify/react";

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [48, 48] });
    }
  }, [map, positions]);
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const handler = () => map.invalidateSize();
    document.addEventListener("route:map-resize", handler);
    return () => document.removeEventListener("route:map-resize", handler);
  }, [map]);
  return null;
}

function GpsLocation() {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (coords.accuracy > 100) return;
        setPosition([coords.latitude, coords.longitude]);
      },
      null,
      { enableHighAccuracy: true, maximumAge: 2000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  function handleLocate() {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 0 });
    }
  }

  return (
    <>
      {position && (
        <>
          <CircleMarker
            center={position}
            radius={24}
            pathOptions={{ color: "#006aff", fillColor: "#006aff", fillOpacity: 0.25, weight: 0 }}
          />
          <CircleMarker
            center={position}
            radius={12}
            pathOptions={{ color: "#ffffff", fillColor: "#006aff", fillOpacity: 1, weight: 4 }}
          />
        </>
      )}
      <div className="absolute top-4 left-43 z-1000">
        <button
          onClick={handleLocate}
          disabled={!position}
          className="flex items-center px-3 py-2.5 rounded-xl bg-neutral-950/90 hover:bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white transition-colors duration-150 backdrop-blur-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon icon="mdi:crosshairs-gps" className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

export default function RouteMap({ geojson, startLat, startLng, navigationMode = false }) {
  const coords = geojson?.coordinates ?? [];
  const positions = coords
    .filter((c) => Array.isArray(c) && c.length >= 2)
    .map(([lng, lat]) => [lat, lng]);

  const hasPath = positions.length > 1;
  const center = hasPath
    ? positions[0]
    : [startLat ?? -6.2088, startLng ?? 106.8456];

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      scrollWheelZoom={true}
      className="relative"
    >
      <ZoomControl position="topright" />
      <MapResizer />
      <TileLayer
        attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
        url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        tileSize={512}
        zoomOffset={-1}
      />
      {hasPath && (
        <>
          <Polyline
            positions={positions}
            pathOptions={{ color: "#ef4444", weight: 5, opacity: 0.9 }}
          />
          <CircleMarker
            center={positions[0]}
            radius={8}
            pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 1, weight: 2 }}
          />
          <CircleMarker
            center={positions[positions.length - 1]}
            radius={8}
            pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 1, weight: 2 }}
          />
          <FitBounds positions={positions} />
        </>
      )}
      {navigationMode && <GpsLocation />}
    </MapContainer>
  );
}
