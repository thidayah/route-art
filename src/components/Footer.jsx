"use client";

import { Icon } from "@iconify/react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-white/6 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
              <Icon icon="mdi:map-marker-path" className="w-3.5 h-3.5 text-neutral-950" />
            </div>
            <span className="text-neutral-300 font-semibold text-sm tracking-tight">
              Route<span className="text-accent">Art</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-[11px] text-neutral-600 uppercase tracking-widest">
            <a href="#rute" className="hover:text-neutral-300 transition-colors duration-150">
              Rute
            </a>
            <a href="#kirim-rute" className="hover:text-neutral-300 transition-colors duration-150">
              Kirim Rute
            </a>
            <a
              href="https://saweria.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors duration-150 flex items-center gap-1.5"
            >
              <Icon icon="mdi:coffee-outline" className="w-3 h-3" />
              Dukung Kami
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/4 flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-700 text-[11px]">
          <p>&copy; {year} RouteArt. Untuk para pelari kreatif Indonesia.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Icon icon="mdi:heart" className="w-3 h-3 text-red-500/60" />
            <span>di Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
