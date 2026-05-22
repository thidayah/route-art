import RouteForm from "@/components/admin/RouteForm";

export default async function NewRoutePage({ searchParams }) {
  const sp = await searchParams;
  const prefill =
    sp?.name || sp?.source_url
      ? { name: sp.name ?? "", source_url: sp.source_url ?? "" }
      : null;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Rute Baru</h1>
        <p className="text-neutral-500 text-sm mt-0.5">
          Tambah rute lari artistik baru
        </p>
      </div>
      <RouteForm prefill={prefill} />
    </div>
  );
}
