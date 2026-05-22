export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://routeart.id";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
