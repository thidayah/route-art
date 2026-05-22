import { gpx } from "@tmcw/togeojson";

/**
 * Parse a GPX File/Blob in the browser and return a GeoJSON LineString.
 *
 * - Uses DOMParser (browser-only) + @tmcw/togeojson
 * - Merges all track segments into a single LineString
 * - Strips elevation — stores only [longitude, latitude] pairs (GeoJSON standard)
 * - Returns null if the file yields fewer than 2 coordinate pairs
 */
export async function gpxFileToGeoJson(file) {
  const text = await file.text();
  const dom = new DOMParser().parseFromString(text, "text/xml");
  const fc = gpx(dom);

  const coordinates = [];
  for (const feature of fc.features) {
    const geom = feature.geometry;
    if (!geom) continue;
    if (geom.type === "LineString") {
      for (const [lng, lat] of geom.coordinates) {
        coordinates.push([lng, lat]);
      }
    } else if (geom.type === "MultiLineString") {
      for (const segment of geom.coordinates) {
        for (const [lng, lat] of segment) {
          coordinates.push([lng, lat]);
        }
      }
    }
  }

  if (coordinates.length < 2) return null;
  return { type: "LineString", coordinates };
}
