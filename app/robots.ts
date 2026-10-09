import type { MetadataRoute } from "next";

import { baseUrl, isProduction } from "@/lib/environment";
import { studioUrl } from "@/sanity/lib/api";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: { userAgent: "*", allow: "/", disallow: [studioUrl, "/api"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
