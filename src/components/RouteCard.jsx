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
  default: "from-lime-500/20 to-green-500/20",
};

const categoryIconColors = {
  hewan: "text-orange-400",
  bunga: "text-pink-400",
  karakter: "text-purple-400",
  objek: "text-blue-400",
  default: "text-lime-400",
};

export default function RouteCard({
  name = "Rute Tidak Dikenal",
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
    <article className="group flex flex-col bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1">
      {/* Thumbnail */}
      <div
        className={`relative h-44 bg-gradient-to-br ${gradientClass} bg-neutral-800 flex items-center justify-center overflow-hidden`}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {/* Route shape art placeholder */}
            <div className="relative">
              <Icon icon={icon} className={`w-16 h-16 ${iconColorClass} opacity-80`} />
              <div
                className={`absolute -inset-4 ${iconColorClass} opacity-10 blur-xl`}
              />
            </div>
            {/* Decorative dots */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-white/10" />
            <div className="absolute top-5 left-7 w-1 h-1 rounded-full bg-white/10" />
            <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-white/5" />
          </>
        )}

        {/* Distance badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${
            isShort
              ? "bg-lime-400 text-neutral-950"
              : "bg-neutral-950/80 text-lime-400 border border-lime-400/30"
          }`}
        >
          {distance} KM
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-bold text-white text-base leading-tight group-hover:text-lime-400 transition-colors duration-200 line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-neutral-500 text-sm">
            <Icon icon="mdi:map-marker" className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{city}</span>
          </div>
        </div>

        <div className="mt-auto">
          <a
            href="#"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-800 hover:bg-lime-400 text-neutral-300 hover:text-neutral-950 text-sm font-semibold border border-neutral-700 hover:border-lime-400 transition-all duration-200 group/btn"
          >
            <Icon
              icon="mdi:route"
              className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200"
            />
            Lihat Rute
          </a>
        </div>
      </div>
    </article>
  );
}
