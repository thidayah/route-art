import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-neutral-900 rounded-2xl border border-white/8 flex items-center justify-center mx-auto mb-6">
            <Icon icon="mdi:map-search" className="w-8 h-8 text-neutral-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">404</h1>
          <p className="text-neutral-500 text-sm mb-8 leading-[1.6]">
            Rute yang kamu cari tidak ditemukan atau belum dipublikasikan.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-semibold text-sm transition-colors duration-150 active:scale-95"
          >
            <Icon icon="mdi:arrow-left" className="w-4 h-4" />
            Kembali ke Beranda
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
