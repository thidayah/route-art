"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
  { href: "/admin/submissions", icon: "mdi:inbox-multiple", label: "Submissions" },
  { href: "/admin/routes", icon: "mdi:map-marker-path", label: "Routes" },
];

export default function AdminPanelLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setChecking(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  async function handleLogout() {
    await supabase?.auth.signOut();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 ">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-56 bg-neutral-900 border-r border-white/6 flex-col z-40">
        <div className="h-14 flex items-center px-4 border-b border-white/6 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Icon icon="mdi:run-fast" className="w-4 h-4 text-neutral-950" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight group-hover:text-accent transition-colors">
              RouteArt
            </span>
            <span className="ml-auto text-[10px] text-neutral-600 font-medium border border-white/8 rounded px-1.5 py-0.5">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "bg-accent/10 text-accent border border-accent/15"
                    : "text-neutral-400 hover:text-white hover:bg-white/4"
                }`}
              >
                <Icon icon={icon} className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2.5 border-t border-white/6 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-500 hover:text-white hover:bg-white/4 transition-colors duration-150"
          >
            <Icon icon="mdi:logout-variant" className="w-4 h-4 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <header className="lg:hidden sticky top-0 z-40 h-14 bg-neutral-900 border-b border-white/6 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Icon icon="mdi:run-fast" className="w-4 h-4 text-neutral-950" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">RouteArt</span>
          <span className="text-[10px] text-neutral-600 font-medium border border-white/8 rounded px-1.5 py-0.5">
            Admin
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-neutral-500 hover:text-white hover:bg-white/4 transition-colors text-sm"
        >
          <Icon icon="mdi:logout-variant" className="w-4 h-4" />
          Keluar
        </button>
      </header>

      {/* Main content */}
      <main className="lg:pl-56 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom nav — mobile */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-neutral-900 border-t border-white/6 flex items-center justify-around px-6">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition-colors duration-150 ${
                active ? "text-accent" : "text-neutral-500 hover:text-white"
              }`}
            >
              <Icon icon={icon} className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
