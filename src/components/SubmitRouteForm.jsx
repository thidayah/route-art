"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

const initialForm = {
  name: "",
  location: "",
  stravaUrl: "",
};

export default function SubmitRouteForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Nama rute wajib diisi";
    }
    if (!form.location.trim()) {
      newErrors.location = "Lokasi wajib diisi";
    }
    if (!form.stravaUrl.trim()) {
      newErrors.stravaUrl = "URL Strava wajib diisi";
    } else if (
      !form.stravaUrl.includes("strava.com") &&
      !form.stravaUrl.startsWith("http")
    ) {
      newErrors.stravaUrl = "Masukkan URL Strava yang valid";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    if (!supabase) {
      setLoading(false);
      setErrors({ form: "Supabase belum dikonfigurasi. Isi kredensial di .env.local." });
      return;
    }
    const { error: sbError } = await supabase.from("ra_submissions").insert({
      name: form.name.trim(),
      location: form.location.trim(),
      strava_url: form.stravaUrl.trim(),
    });
    setLoading(false);

    if (sbError) {
      setErrors({ form: "Gagal mengirim rute. Silakan coba lagi." });
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrors({});
  };

  return (
    <section
      id="kirim-rute"
      className="py-24 px-4 sm:px-6 border-t border-white/6"
    >
      <div className="max-w-xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-accent/80 text-[11px] font-semibold uppercase tracking-widest">
            Kontribusi
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3 tracking-tight">
            Kirim Rute Kamu
          </h2>
          <p className="text-neutral-500 text-sm max-w-sm mx-auto leading-[1.6]">
            Punya rute lari berbentuk unik? Bagikan ke RouteArt dan
            ilhami pelari lain!
          </p>
        </div>

        {submitted ? (
          /* Success State */
          <div className="text-center py-12 px-6 bg-neutral-900 rounded-2xl border border-white/6">
            <div className="w-16 h-16 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:check-circle" className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Rute Berhasil Dikirim!
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
              Rute kamu sedang dalam proses peninjauan. Terima kasih sudah berkontribusi.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold border border-neutral-700 hover:border-neutral-600 transition-colors duration-150"
            >
              Kirim Rute Lain
            </button>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 rounded-2xl border border-white/6 p-6 sm:p-8 space-y-5"
          >
            {/* Route name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-neutral-300 mb-1.5"
              >
                Nama Rute{" "}
                <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Kucing Lucu"
                className={`w-full px-4 py-3 bg-neutral-800 border ${
                  errors.name
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-white/10 focus:border-accent/50"
                } rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-colors duration-150 focus:ring-2 ${
                  errors.name
                    ? "focus:ring-red-500/10"
                    : "focus:ring-accent/10"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-neutral-300 mb-1.5"
              >
                Lokasi / Kota{" "}
                <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:map-marker"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
                />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Contoh: Bandung"
                  className={`w-full pl-10 pr-4 py-3 bg-neutral-800 border ${
                    errors.location
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-accent/50"
                  } rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-colors duration-150 focus:ring-2 ${
                    errors.location
                      ? "focus:ring-red-500/10"
                      : "focus:ring-accent/10"
                  }`}
                />
              </div>
              {errors.location && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3.5 h-3.5" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Strava URL */}
            <div>
              <label
                htmlFor="stravaUrl"
                className="block text-sm font-semibold text-neutral-300 mb-1.5"
              >
                URL Aktivitas Strava{" "}
                <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Icon
                  icon="simple-icons:strava"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500"
                />
                <input
                  type="url"
                  id="stravaUrl"
                  name="stravaUrl"
                  value={form.stravaUrl}
                  onChange={handleChange}
                  placeholder="https://www.strava.com/activities/..."
                  className={`w-full pl-10 pr-4 py-3 bg-neutral-800 border ${
                    errors.stravaUrl
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-accent/50"
                  } rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-colors duration-150 focus:ring-2 ${
                    errors.stravaUrl
                      ? "focus:ring-red-500/10"
                      : "focus:ring-accent/10"
                  }`}
                />
              </div>
              {errors.stravaUrl && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3.5 h-3.5" />
                  {errors.stravaUrl}
                </p>
              )}
              <p className="mt-1.5 text-xs text-neutral-600">
                Pastikan aktivitas Strava kamu bersifat publik
              </p>
            </div>

            {/* Form-level error */}
            {errors.form && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 -mb-1">
                <Icon icon="mdi:alert-circle" className="w-3.5 h-3.5 shrink-0" />
                {errors.form}
              </p>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-[44px] rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-semibold text-sm transition-colors duration-150 active:scale-95"
              >
                {loading ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="w-5 h-5 animate-spin"
                    />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:send" className="w-5 h-5" />
                    Kirim Rute
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
