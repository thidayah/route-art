"use client";

import { use, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import RouteForm from "@/components/admin/RouteForm";

export default function EditRoutePage({ params }) {
  const { id } = use(params);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!supabase || !id) {
      setLoading(false);
      return;
    }
    supabase
      .from("ra_routes")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setRoute(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !route) {
    return (
      <div className="p-6 text-center py-24">
        <Icon
          icon="mdi:map-search-outline"
          className="w-10 h-10 text-neutral-700 mx-auto mb-3"
        />
        <p className="text-neutral-500 text-sm">Rute tidak ditemukan.</p>
        <a
          href="/admin/routes"
          className="inline-flex items-center gap-1.5 mt-4 text-xs text-accent hover:underline"
        >
          <Icon icon="mdi:arrow-left" className="w-3.5 h-3.5" />
          Kembali ke Routes
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Edit Rute</h1>
        <p className="text-neutral-500 text-sm mt-0.5 truncate">{route.name}</p>
      </div>
      <RouteForm initialData={route} />
    </div>
  );
}
