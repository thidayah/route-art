import { Icon } from "@iconify/react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient & decoration */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-lime-400/3 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#a3e635 1px, transparent 1px), linear-gradient(90deg, #a3e635 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-sm font-medium">
          <Icon icon="mdi:run" className="w-4 h-4" />
          <span>Rute Lari Artistik</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6">
          Lari{" "}
          <span className="text-lime-400 relative">
            Dengan
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-lime-400/30 rounded-full" />
          </span>
          <br />
          Gaya
        </h1>

        {/* Description */}
        <p className="max-w-xl mx-auto text-base sm:text-lg text-neutral-400 leading-relaxed mb-10">
          Temukan rute lari kreatif berbentuk hewan, bunga, karakter, dan karya
          seni di kotamu. Ubah setiap langkah menjadi pengalaman artistik yang
          tak terlupakan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#rute"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold rounded-2xl text-base transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-lime-400/25 active:scale-100"
          >
            <Icon icon="mdi:compass-outline" className="w-5 h-5" />
            Jelajahi Rute
          </a>
          <a
            href="#kirim-rute"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-neutral-800 text-white font-bold rounded-2xl text-base border border-neutral-700 hover:border-neutral-600 transition-all duration-200 hover:scale-105 active:scale-100"
          >
            <Icon icon="mdi:map-plus" className="w-5 h-5" />
            Kirim Rute
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-10 border-t border-neutral-800 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: "50+", label: "Rute Tersedia" },
            { value: "12", label: "Kota" },
            { value: "2.4K", label: "Pelari Aktif" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-lime-400">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-neutral-500 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-600 animate-bounce">
        <Icon icon="mdi:chevron-down" className="w-6 h-6" />
      </div>
    </section>
  );
}
