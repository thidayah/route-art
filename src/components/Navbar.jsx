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
      className={`fixed top-0 left-0 right-0 z-9999 transition-colors duration-200 ${
        scrolled
          ? "bg-neutral-950/95 backdrop-blur-sm border-b border-white/6"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center group-hover:bg-accent-hover transition-colors duration-150">
              <Icon icon="mdi:map-marker-path" className="w-4 h-4 text-neutral-950" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">
              Route<span className="text-accent">Art</span>
            </span>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a
              href="https://saweria.co"
              target="_blank"
              rel="noopener noreferrer"
              title="Dukung kami dengan traktir kopi"
              className="flex items-center gap-1.5 px-3 h-[36px] rounded-lg bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/12 text-neutral-400 hover:text-neutral-100 transition-colors duration-150 text-[13px] font-medium"
            >
              <Icon icon="mdi:coffee-outline" className="w-4 h-4" />
              <span className="hidden sm:inline">Traktir Kopi</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
