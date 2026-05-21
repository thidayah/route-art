"use client";

import { Icon } from "@iconify/react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-lime-400/[0.04] rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-8 rounded-full bg-neutral-800/80 border border-white/8 text-neutral-400 text-[11px] font-medium uppercase tracking-widest">
          <Icon icon="mdi:run" className="w-3.5 h-3.5 text-lime-400" />
          <span>Rute Lari Artistik</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none tracking-tighter mb-6">
          Lari{" "}
          <span className="text-lime-400">Dengan</span>
          <br />
          Gaya
        </h1>

        {/* Description */}
        <p className="max-w-md mx-auto text-base text-neutral-400 leading-[1.6] mb-10">
          Temukan rute lari kreatif berbentuk hewan, bunga, karakter, dan karya
          seni di kotamu. Ubah setiap langkah menjadi pengalaman artistik.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#rute"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-[11px] min-h-[44px] bg-lime-400 hover:bg-lime-300 text-neutral-950 font-semibold rounded-xl text-sm transition-colors duration-150 active:scale-95"
          >
            <Icon icon="mdi:compass-outline" className="w-4 h-4" />
            Jelajahi Rute
          </a>
          <a
            href="#kirim-rute"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-[11px] min-h-[44px] bg-transparent hover:bg-white/4 text-neutral-300 hover:text-white font-medium rounded-xl text-sm border border-white/10 hover:border-white/16 transition-colors duration-150 active:scale-95"
          >
            <Icon icon="mdi:map-plus" className="w-4 h-4" />
            Kirim Rute
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-10 border-t border-white/6 grid grid-cols-3 gap-8 max-w-sm mx-auto">
          {[
            { value: "50+", label: "Rute Tersedia" },
            { value: "12", label: "Kota" },
            { value: "2.4K", label: "Pelari Aktif" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-lime-400 tabular-nums tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1.5 leading-tight uppercase tracking-[0.06em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-600 animate-bounce">
        <Icon icon="mdi:chevron-down" className="w-5 h-5" />
      </div>
    </section>
  );
}
