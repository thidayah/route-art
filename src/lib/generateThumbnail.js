const WIDTH = 400;
const HEIGHT = 400;
const PADDING = 28;
const BG = "transparent";

// Vivid hues that look sharp on dark/transparent backgrounds.
// Excludes the ~80° lime-400 band used by the app theme.
const STROKE_PALETTE = [
  "#f87171", // red-400
  "#fb923c", // orange-400
  "#facc15", // yellow-400
  "#34d399", // emerald-400
  "#22d3ee", // cyan-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
  "#e879f9", // fuchsia-400
  "#2dd4bf", // teal-400
];

function randomStroke() {
  return STROKE_PALETTE[Math.floor(Math.random() * STROKE_PALETTE.length)];
}

/**
 * Generate an SVG string from a GeoJSON LineString.
 *
 * - Normalizes all coordinates to fit within a 400×400 viewport with padding
 * - Flips the Y-axis: higher latitude maps to a lower SVG y-coordinate
 * - Preserves route aspect ratio by using uniform scale (min of x/y scale)
 * - Returns null if fewer than 2 coordinate pairs
 */
export function generateRouteSvg(geojson) {
  const coords = geojson?.coordinates;
  if (!coords || coords.length < 2) return null;

  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  const lngRange = maxLng - minLng || 0.0001;
  const latRange = maxLat - minLat || 0.0001;
  const drawW = WIDTH - PADDING * 2;
  const drawH = HEIGHT - PADDING * 2;

  // Uniform scale preserves route shape; center within drawing area
  const scale = Math.min(drawW / lngRange, drawH / latRange);
  const offsetX = PADDING + (drawW - lngRange * scale) / 2;
  const offsetY = PADDING + (drawH - latRange * scale) / 2;

  const points = coords
    .map(([lng, lat]) => {
      const x = offsetX + (lng - minLng) * scale;
      const y = offsetY + (maxLat - lat) * scale;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">`,
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>`,
    `<polyline points="${points}" fill="none" stroke="${randomStroke()}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    `</svg>`,
  ].join("");
}

/**
 * Convert an SVG string to a Blob with the correct MIME type.
 */
export function svgStringToBlob(svgString) {
  return new Blob([svgString], { type: "image/svg+xml" });
}
