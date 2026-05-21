"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

const categoryIcons = {
  hewan: "mdi:paw",
  bunga: "mdi:flower",
  karakter: "mdi:account-star",
  objek: "mdi:shape",
  default: "mdi:map-marker-path",
};

const categoryColors = {
  hewan: "from-orange-500/20 to-yellow-500/20",
  bunga: "from-pink-500/20 to-rose-500/20",
  karakter: "from-purple-500/20 to-indigo-500/20",
  objek: "from-blue-500/20 to-cyan-500/20",
  default: "from-accent-dark/20 to-green-500/20",
};

const categoryIconColors = {
  hewan: "text-orange-400",
  bunga: "text-pink-400",
  karakter: "text-purple-400",
  objek: "text-blue-400",
  default: "text-accent",
};

export default function RouteCard({
  name = "Rute Tidak Dikenal",
  slug = "",
  city = "Indonesia",
  distance = 0,
  category = "default",
  thumbnailUrl = null,
}) {
  const icon = categoryIcons[category] || categoryIcons.default;
  const gradientClass = categoryColors[category] || categoryColors.default;
  const iconColorClass =
    categoryIconColors[category] || categoryIconColors.default;

  const isShort = distance < 10;

  return (
    <article className="group flex flex-col bg-neutral-900 rounded-2xl overflow-hidden border border-white/6 hover:border-white/10 transition-colors duration-200">
      {/* Thumbnail */}
      <div
        className={`relative h-48 bg-linear-to-br ${gradientClass} bg-neutral-800 flex items-center justify-center overflow-hidden`}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon icon={icon} className={`w-14 h-14 ${iconColorClass} opacity-60`} />
        )}

        {/* Distance badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-bold tracking-wide ${
            isShort
              ? "bg-accent text-neutral-950"
              : "bg-neutral-950/80 text-accent border border-accent/25 backdrop-blur-sm"
          }`}
        >
          {distance} KM
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-neutral-100 text-sm leading-snug group-hover:text-accent transition-colors duration-150 line-clamp-2 tracking-[-0.01em]">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-neutral-600 text-[11px] uppercase tracking-[0.06em]">
            <Icon icon="mdi:map-marker" className="w-3 h-3 shrink-0 text-neutral-500" />
            <span className="truncate">{city}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            href={`/routes/${slug}`}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/4 hover:bg-accent text-neutral-400 hover:text-neutral-950 text-xs font-medium border border-white/6 hover:border-accent transition-colors duration-150"
          >
            <Icon icon="mdi:route" className="w-3.5 h-3.5" />
            Lihat Rute
          </Link>
        </div>
      </div>
    </article>
  );
}
