"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
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
      className="py-16 px-4 sm:px-6 bg-neutral-900/50 border-t border-neutral-800"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/20 mb-4">
            <Icon icon="mdi:map-plus" className="w-7 h-7 text-lime-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Kirim Rute Kamu
          </h2>
          <p className="text-neutral-500 text-base max-w-md mx-auto">
            Punya rute lari berbentuk unik? Bagikan ke komunitas RouteArt dan
            ilhami pelari lain!
          </p>
        </div>

        {submitted ? (
          /* Success State */
          <div className="text-center py-12 px-6 bg-neutral-900 rounded-2xl border border-neutral-800">
            <div className="w-16 h-16 bg-lime-400/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:check-circle" className="w-8 h-8 text-lime-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Rute Berhasil Dikirim!
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
              Rute kamu sedang dalam proses peninjauan. Kami akan menghubungi
              kamu setelah rute disetujui.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold border border-neutral-700 hover:border-neutral-600 transition-all duration-200"
            >
              Kirim Rute Lain
            </button>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 sm:p-8 space-y-5"
          >
            {/* Route name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-neutral-300 mb-1.5"
              >
                Nama Rute{" "}
                <span className="text-lime-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Naga Emas Monas"
                className={`w-full px-4 py-3 bg-neutral-800 border ${
                  errors.name
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-neutral-700 focus:border-lime-400/50"
                } rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-all duration-200 focus:ring-2 ${
                  errors.name
                    ? "focus:ring-red-500/10"
                    : "focus:ring-lime-400/10"
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
                <span className="text-lime-400">*</span>
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:map-marker"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-500"
                />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Contoh: Jakarta Pusat"
                  className={`w-full pl-10 pr-4 py-3 bg-neutral-800 border ${
                    errors.location
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-neutral-700 focus:border-lime-400/50"
                  } rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-all duration-200 focus:ring-2 ${
                    errors.location
                      ? "focus:ring-red-500/10"
                      : "focus:ring-lime-400/10"
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
                <span className="text-lime-400">*</span>
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
                      : "border-neutral-700 focus:border-lime-400/50"
                  } rounded-xl text-white placeholder-neutral-600 text-sm outline-none transition-all duration-200 focus:ring-2 ${
                    errors.stravaUrl
                      ? "focus:ring-red-500/10"
                      : "focus:ring-lime-400/10"
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

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-950 font-bold text-base transition-all duration-200 hover:scale-[1.02] active:scale-100 hover:shadow-lg hover:shadow-lime-400/20"
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
