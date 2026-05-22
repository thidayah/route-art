"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!supabase) {
      setError("Supabase belum dikonfigurasi.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.replace("/admin/submissions");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Icon icon="mdi:shield-key" className="w-5 h-5 text-neutral-950" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              Admin Panel
            </span>
          </div>
          <p className="text-neutral-500 text-sm">
            Masuk untuk mengelola RouteArt
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 rounded-2xl border border-white/8 p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full h-10 px-3 rounded-xl bg-neutral-800 border border-white/8 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-xl bg-neutral-800 border border-white/8 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <Icon icon="mdi:alert-circle" className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl bg-accent hover:bg-accent-hover text-neutral-950 font-semibold text-sm transition-colors duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            ← Kembali ke Beranda
          </a>
        </p>
      </div>
    </main>
  );
}
