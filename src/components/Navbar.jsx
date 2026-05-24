"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [qrisOpen, setQrisOpen] = useState(false);
  // const [qrisLoaded, setQrisLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (qrisOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // setQrisLoaded(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [qrisOpen]);

  return (
    <>
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
              <button
                onClick={() => setQrisOpen(true)}
                title="Dukung kami dengan traktir kopi"
                className="flex items-center gap-1.5 px-3 h-[36px] rounded-lg bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/12 text-neutral-400 hover:text-neutral-100 transition-colors duration-150 text-[13px] font-medium cursor-pointer"
              >
                <Icon icon="mdi:coffee-outline" className="w-4 h-4" />
                <span className="hidden sm:inline">Traktir Kopi</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* QRIS Modal */}
      {qrisOpen && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center p-4"
          onClick={() => setQrisOpen(false)}
        >
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm" />
          <div
            className="relative bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrisOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 hover:text-white hover:bg-white/8 transition-colors duration-150"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <p className="text-white font-semibold text-lg">by Runminders</p>
              <p className="text-neutral-500 text-sm mt-1">Scan QRIS untuk mendukung kami</p>
            </div>

            <div className="rounded-2xl flex overflow-hidden bg-neutral-200 relative">
              {/* {qrisLoaded && ( */}
                <div className=" w-full h-100 bg-neutral-800 animate-pulse rounded-sm " />
              {/* )} */}
              <img
                src="/qris.png"
                alt="QRIS Runminders"
                className="object-cover"
                // onLoad={() => setQrisLoaded(true)}
              />
            </div>

            <p className="text-center text-neutral-500 text-[11px] mt-3">
              Makasih udah jajanin yaa!               
            </p>
          </div>
        </div>
      )}
    </>
  );
}
