"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import { gpxFileToGeoJson } from "@/lib/gpxToGeoJson";
import { generateRouteSvg, svgStringToBlob } from "@/lib/generateThumbnail";

const CATEGORIES = [
  { value: "hewan", label: "Hewan" },
  { value: "bunga", label: "Bunga" },
  { value: "karakter", label: "Karakter" },
  { value: "objek", label: "Objek" },
  { value: "race", label: "Race" },
  { value: "default", label: "Umum" },
];

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPTY_GEOJSON = '{\n  "type": "LineString",\n  "coordinates": []\n}';

const inputClass =
  "w-full h-10 px-3 rounded-xl bg-neutral-800 border border-white/8 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-accent/50 transition-colors";

const labelClass = "block text-xs font-medium text-neutral-400 mb-1.5";

export default function RouteForm({ initialData = null, prefill = null }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const prefillName = prefill?.name ?? "";
  const [form, setForm] = useState({
    name: initialData?.name ?? prefillName,
    slug: initialData?.slug ?? (prefillName ? toSlug(prefillName) : ""),
    city: initialData?.city ?? "",
    distance_km: initialData?.distance_km ?? "",
    category: initialData?.category ?? "default",
    status: initialData?.status ?? "draft",
    start_lat: initialData?.start_lat ?? "",
    start_lng: initialData?.start_lng ?? "",
    source_url: initialData?.source_url ?? prefill?.source_url ?? "",
    thumbnail_url: initialData?.thumbnail_url ?? "",
    gpx_file_url: initialData?.gpx_file_url ?? "",
    geojson: initialData?.geojson
      ? JSON.stringify(initialData.geojson, null, 2)
      : EMPTY_GEOJSON,
  });

  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGpx, setUploadingGpx] = useState(false);
  const [error, setError] = useState(null);

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !slugManual) {
        next.slug = toSlug(value);
      }
      return next;
    });
  }

  async function uploadFile(file, bucket, path, options = {}) {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, ...options });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleThumbUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploadingThumb(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop();
      const routeId = initialData?.id ?? crypto.randomUUID();
      const url = await uploadFile(
        file,
        "route-thumbnails",
        `${routeId}/thumbnail.${ext}`
      );
      set("thumbnail_url", url);
    } catch (err) {
      setError(`Upload thumbnail gagal: ${err.message}`);
    }
    setUploadingThumb(false);
    e.target.value = "";
  }

  async function handleGpxUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploadingGpx(true);
    setError(null);
    try {
      const routeId = initialData?.id ?? crypto.randomUUID();

      // 1. Upload GPX file to storage
      const gpxUrl = await uploadFile(file, "route-gpx", `${routeId}/route.gpx`);
      set("gpx_file_url", gpxUrl);

      // 2. Parse GPX → GeoJSON LineString
      const geoJson = await gpxFileToGeoJson(file);
      if (geoJson) {
        set("geojson", JSON.stringify(geoJson, null, 2));

        // Auto-fill start coordinates from first track point
        const [firstLng, firstLat] = geoJson.coordinates[0];
        set("start_lat", firstLat);
        set("start_lng", firstLng);

        // 3. Auto-generate SVG thumbnail only when none is set yet
        if (!form.thumbnail_url) {
          const svg = generateRouteSvg(geoJson);
          if (svg) {
            const blob = svgStringToBlob(svg);
            const thumbUrl = await uploadFile(
              blob,
              "route-thumbnails",
              `${routeId}/thumbnail.svg`,
              { contentType: "image/svg+xml" }
            );
            set("thumbnail_url", thumbUrl);
          }
        }
      }
    } catch (err) {
      setError(`Upload GPX gagal: ${err.message}`);
    }
    setUploadingGpx(false);
    e.target.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!supabase) {
      setError("Supabase belum dikonfigurasi.");
      setSaving(false);
      return;
    }

    let geojsonParsed;
    try {
      geojsonParsed = JSON.parse(form.geojson);
    } catch {
      setError("Format GeoJSON tidak valid. Pastikan sintaks JSON benar.");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      city: form.city.trim(),
      distance_km: parseFloat(form.distance_km),
      category: form.category,
      status: form.status,
      start_lat: form.start_lat !== "" ? parseFloat(form.start_lat) : null,
      start_lng: form.start_lng !== "" ? parseFloat(form.start_lng) : null,
      source_url: form.source_url.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      gpx_file_url: form.gpx_file_url.trim() || null,
      geojson: geojsonParsed,
    };

    let err;
    if (isEdit) {
      ({ error: err } = await supabase
        .from("ra_routes")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      ({ error: err } = await supabase.from("ra_routes").insert(payload));
    }

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/routes");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <Icon icon="mdi:alert-circle" className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Core info */}
      <section className="bg-neutral-900 rounded-2xl border border-white/8 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Informasi Dasar</h2>

        <div>
          <label className={labelClass}>Nama Rute</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            placeholder="Kucing Lucu"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Slug
              <span className="ml-1.5 text-neutral-600 font-normal">
                (URL path)
              </span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                set("slug", e.target.value);
              }}
              required
              placeholder="kucing-lucu"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Kota</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              required
              placeholder="Bandung"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Jarak (km)</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={form.distance_km}
              onChange={(e) => set("distance_km", e.target.value)}
              required
              placeholder="5.4"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Kategori</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>        

        <div>
          <label className={labelClass}>
            URL Sumber
            <span className="ml-1.5 text-neutral-600 font-normal">(kredit submisi)</span>
          </label>
          <input
            type="url"
            value={form.source_url}
            onChange={(e) => set("source_url", e.target.value)}
            placeholder="https://www.strava.com/activities/..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Status Publikasi</label>
          <div className="flex gap-3">
            {["draft", "published"].map((s) => (
              <label
                key={s}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                  form.status === s
                    ? "bg-accent/10 border-accent/20 text-accent"
                    : "bg-neutral-800 border-white/8 text-neutral-400 hover:text-white"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={form.status === s}
                  onChange={() => set("status", s)}
                  className="sr-only"
                />
                <Icon
                  icon={s === "published" ? "mdi:eye-outline" : "mdi:pencil-outline"}
                  className="w-3.5 h-3.5"
                />
                {s === "published" ? "Published" : "Draft"}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Files */}
      <section className="bg-neutral-900 rounded-2xl border border-white/8 p-5 space-y-5">
        <h2 className="text-sm font-semibold text-white">Thumbnail & GPX</h2>

        {/* GPX */}
        <div>
          <label className={labelClass}>File GPX</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.gpx_file_url}
              onChange={(e) => set("gpx_file_url", e.target.value)}
              placeholder="https://... atau upload file"
              className={`${inputClass} flex-1`}
            />
            <label
              className={`flex items-center gap-1.5 px-3 h-10 rounded-xl border text-xs font-medium transition-colors shrink-0 ${
                uploadingGpx
                  ? "bg-neutral-800 border-white/8 text-neutral-600 cursor-wait"
                  : "bg-neutral-800 hover:bg-neutral-700 border-white/8 text-neutral-300 cursor-pointer"
              }`}
            >
              {uploadingGpx ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-500 border-t-transparent animate-spin" />
              ) : (
                <Icon icon="mdi:upload" className="w-3.5 h-3.5" />
              )}
              Upload
              <input
                type="file"
                accept=".gpx,application/gpx+xml"
                className="sr-only"
                onChange={handleGpxUpload}
                disabled={uploadingGpx}
              />
            </label>
          </div>
          {form.gpx_file_url && (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-xl border border-white/6 w-fit">
              <Icon icon="mdi:file-xml-box" className="w-4 h-4 text-accent" />
              <span className="text-xs text-neutral-400 max-w-xs truncate">
                {form.gpx_file_url.split("/").pop()}
              </span>
              <button
                type="button"
                onClick={() => set("gpx_file_url", "")}
                className="text-neutral-600 hover:text-white transition-colors"
              >
                <Icon icon="mdi:close" className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className={labelClass}>Thumbnail</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.thumbnail_url}
              onChange={(e) => set("thumbnail_url", e.target.value)}
              placeholder="https://... atau upload file"
              className={`${inputClass} flex-1`}
            />
            <label
              className={`flex items-center gap-1.5 px-3 h-10 rounded-xl border text-xs font-medium transition-colors shrink-0 ${
                uploadingThumb
                  ? "bg-neutral-800 border-white/8 text-neutral-600 cursor-wait"
                  : "bg-neutral-800 hover:bg-neutral-700 border-white/8 text-neutral-300 cursor-pointer"
              }`}
            >
              {uploadingThumb ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-500 border-t-transparent animate-spin" />
              ) : (
                <Icon icon="mdi:upload" className="w-3.5 h-3.5" />
              )}
              Upload
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleThumbUpload}
                disabled={uploadingThumb}
              />
            </label>
          </div>
          {form.thumbnail_url && (
            <div className="mt-2 relative w-fit">
              <img
                src={form.thumbnail_url}
                alt="Thumbnail preview"
                className="h-20 rounded-xl object-cover border border-white/8"
              />
              <button
                type="button"
                onClick={() => set("thumbnail_url", "")}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-900 border border-white/8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              >
                <Icon icon="mdi:close" className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Coordinates */}
      <section className="bg-neutral-900 rounded-2xl border border-white/8 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Koordinat Titik Mulai</h2>
        <p className="text-xs text-neutral-600 -mt-2">
          Digunakan untuk tombol navigasi Google Maps
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Latitude</label>
            <input
              type="number"
              step="any"
              value={form.start_lat}
              onChange={(e) => set("start_lat", e.target.value)}
              placeholder="-6.2088"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input
              type="number"
              step="any"
              value={form.start_lng}
              onChange={(e) => set("start_lng", e.target.value)}
              placeholder="106.8456"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* GeoJSON */}
      <section className="bg-neutral-900 rounded-2xl border border-white/8 p-5 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-white">GeoJSON</h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            LineString dengan koordinat [longitude, latitude]
          </p>
        </div>
        <textarea
          value={form.geojson}
          onChange={(e) => set("geojson", e.target.value)}
          rows={10}
          spellCheck={false}
          className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-white/8 text-white text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-accent/50 transition-colors resize-y leading-relaxed"
        />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 pb-6">
        <button
          type="submit"
          disabled={saving || uploadingThumb || uploadingGpx}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-semibold text-sm transition-colors duration-150 active:scale-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed "
        >
          {saving ? (
            <div className="w-4 h-4 rounded-full border-2 border-neutral-950/40 border-t-neutral-950 animate-spin" />
          ) : (
            <Icon
              icon={isEdit ? "mdi:content-save-outline" : "mdi:plus-circle-outline"}
              className="w-4 h-4"
            />
          )}
          {isEdit ? "Simpan Perubahan" : "Buat Rute"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white font-medium text-sm border border-white/8 transition-colors cursor-pointer"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
