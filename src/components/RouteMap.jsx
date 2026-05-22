"use client";

import { useEffect, useRef, useState } from "react";
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
  const positionRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (coords.accuracy > 100) return;
        const pos = [coords.latitude, coords.longitude];
        positionRef.current = pos;
        setPosition(pos);
      },
      null,
      { enableHighAccuracy: true, maximumAge: 2000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  useEffect(() => {
    const handler = () => {
      const pos = positionRef.current;
      if (pos) map.flyTo(pos, Math.max(map.getZoom(), 15), { duration: 0 });
    };
    document.addEventListener("route:gps-recenter", handler);
    return () => document.removeEventListener("route:gps-recenter", handler);
  }, [map]);

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
