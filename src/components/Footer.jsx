import { Icon } from "@iconify/react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo & tagline */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-lime-400 rounded-lg flex items-center justify-center">
                <Icon
                  icon="mdi:map-marker-path"
                  className="w-4 h-4 text-neutral-950"
                />
              </div>
              <span className="text-white font-bold text-base tracking-tight">
                Route<span className="text-lime-400">Art</span>
              </span>
            </div>
            <p className="text-neutral-600 text-xs">
              Lari Dengan Gaya
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-neutral-500">
            <a href="#rute" className="hover:text-white transition-colors duration-150">
              Rute
            </a>
            <a href="#kirim-rute" className="hover:text-white transition-colors duration-150">
              Kirim Rute
            </a>
            <a
              href="https://saweria.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lime-400 transition-colors duration-150 flex items-center gap-1"
            >
              <Icon icon="mdi:coffee-outline" className="w-4 h-4" />
              Dukung Kami
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-600 text-xs">
          <p>&copy; {year} RouteArt. Dibuat dengan semangat untuk para pelari kreatif Indonesia.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Icon icon="mdi:heart" className="w-3.5 h-3.5 text-red-500" />
            <span>di Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
