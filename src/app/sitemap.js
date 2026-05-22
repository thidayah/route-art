import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://routeart.id";

  const { data } = supabase
    ? await supabase
        .from("ra_routes")
        .select("slug, created_at")
        .eq("status", "published")
    : { data: null };

  const routes = (data ?? []).map((r) => ({
    url: `${baseUrl}/routes/${r.slug}`,
    lastModified: new Date(r.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...routes,
  ];
}
