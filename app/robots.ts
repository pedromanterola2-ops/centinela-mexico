import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/busqueda", "/api/"],
      },
    ],
    sitemap: "https://centinelamex.com/sitemap.xml",
  };
}
