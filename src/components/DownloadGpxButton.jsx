"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

function toFilename(name, distance) {
  const safe = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `${safe}_${distance}km.gpx`;
}

export default function DownloadGpxButton({ url, name, distance }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = toFilename(name, distance);
      a.click();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm border border-white/8 hover:border-white/12 transition-colors duration-150 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Icon
        icon={downloading ? "mdi:loading" : "mdi:download"}
        className={`w-4 h-4 ${downloading ? "animate-spin" : ""}`}
      />
      {downloading ? "Mengunduh..." : "Unduh GPX"}
    </button>
  );
}
