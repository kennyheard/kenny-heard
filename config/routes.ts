import { defineLinkRoutes } from "@driftime/sanity-plugin-link/render";
import type {
  SanityLinkDocument,
  SanityLinkRouteDefinition,
  SanityLinkRouteInput,
} from "@driftime/sanity-plugin-link/render";
import type { MetadataRoute } from "next";
import type { SanityDocument } from "sanity";

import type { Strict } from "@/types";

/** Link plugin route with sitemap hints and whether search engines may list it. */
export interface RouteDefinition extends SanityLinkRouteDefinition {
  /** Sitemap values for every page at this route. */
  sitemap?: Partial<MetadataRoute.Sitemap[number]>;
  /** Whether search engines may list pages at this route, or undefined when they may. */
  isIndexed?: boolean;
}

/** A route and the parameters its path needs, for linking without a document. */
export type SanityRoute = SanityLinkRouteInput<typeof routes>;

/** Sanity document types that have their own route. */
export type SanityRoutedDocumentType = keyof typeof routes;

/** Fetched Sanity document that has its own route. */
export type SanityRoutedDocument = Strict<SanityDocument> & SanityLinkDocument & { _type: SanityRoutedDocumentType };

/** Path and sitemap values for each routed document type. */
export const routes = defineLinkRoutes({
  home: {
    path: "/",
    sitemap: { changeFrequency: "weekly", priority: 1 },
  },
  page: {
    path: "/[slug]",
    params: { slug: "slug.current" },
    sitemap: { changeFrequency: "monthly", priority: 0.9 },
  },
} as const satisfies Record<string, RouteDefinition>);

/**
 * Checks whether search engines may list the pages of a routed document type.
 *
 * @param type - Document type of the route.
 * @returns Whether its pages may be indexed.
 */
export function isIndexedRoute(type: SanityRoutedDocumentType) {
  const route: RouteDefinition = routes[type];

  return route.isIndexed ?? true;
}
