import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";

import { resolveRoute } from "@/config/links";
import { isIndexedRoute, routes } from "@/config/routes";
import type { RouteDefinition } from "@/config/routes";
import { baseUrl } from "@/lib/environment";
import { isDefined } from "@/lib/utils";
import { sitemapQuery } from "@/sanity/groq/routes";
import { sanityFetchCached } from "@/sanity/lib/live";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("days");

  const { data: documents } = await sanityFetchCached({ query: sitemapQuery, perspective: "published" });

  return (documents ?? [])
    .filter((document) => isDefined(document))
    .flatMap((document) => {
      const route = resolveRoute(document);
      if (!isDefined(route) || !isIndexedRoute(document._type)) return [];

      const definition: RouteDefinition = routes[document._type];

      return {
        ...definition.sitemap,
        url: new URL(route, baseUrl).href,
        lastModified: new Date(document._updatedAt),
      };
    });
}
