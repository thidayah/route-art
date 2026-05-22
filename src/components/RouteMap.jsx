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

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [48, 48] });
    }
  }, [map, positions]);
  return null;
}

function FullscreenResizer() {
  const map = useMap();
  useEffect(() => {
    const handler = () => setTimeout(() => map.invalidateSize(), 100);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [map]);
  return null;
}

function GpsTracker() {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const latlng = [coords.latitude, coords.longitude];
        setPosition(latlng);
        map.flyTo(latlng, Math.max(map.getZoom(), 16), { duration: 1.2 });
      },
      null,
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [map]);

  if (!position) return null;

  return (
    <>
      <CircleMarker
        center={position}
        radius={14}
        pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15, weight: 2 }}
      />
      <CircleMarker
        center={position}
        radius={7}
        pathOptions={{ color: "#ffffff", fillColor: "#3b82f6", fillOpacity: 1, weight: 2 }}
      />
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
    >
      <ZoomControl position="topright" />
      <FullscreenResizer />
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
      {navigationMode && <GpsTracker />}
    </MapContainer>
  );
}
