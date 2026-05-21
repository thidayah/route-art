"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/60 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center group-hover:bg-lime-300 transition-colors duration-200">
              <Icon
                icon="mdi:map-marker-path"
                className="w-5 h-5 text-neutral-950"
              />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Route<span className="text-lime-400">Art</span>
            </span>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a
              href="https://saweria.co"
              target="_blank"
              rel="noopener noreferrer"
              title="Dukung kami dengan traktir kopi"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800/70 hover:bg-neutral-700 border border-neutral-700/50 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all duration-200 text-sm font-medium"
            >
              <Icon icon="mdi:coffee-outline" className="w-5 h-5" />
              <span className="hidden sm:inline">Traktir Kopi</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
