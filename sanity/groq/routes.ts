import { routeParamsFragment } from "@/config/links";
import { routes } from "@/config/routes";
import type { SanityRoutedDocument, SanityRoutedDocumentType } from "@/config/routes";
import { objectEntries, objectKeys } from "@/lib/utils";
import { defineTypedQuery } from "@/sanity/lib/groq";
import type { Nullable } from "@/types";

/**
 * Builds a query for the route parameters of every document of a type, for static generation.
 *
 * @param type - The routed document type.
 * @returns A query returning one set of route parameters per document.
 */
export function createStaticParamsQuery<T>(type: SanityRoutedDocumentType) {
  const routeParams: Record<string, string> = routes[type].params ?? {};
  const params = objectEntries(routeParams);
  const filters = [`_type == "${type}"`, ...params.map(([, expression]) => `defined(${expression})`)];
  const projection = params.map(([param, expression]) => `"${param}": ${expression}`).join(", ");

  return defineTypedQuery<T>(`*[${filters.join(" && ")}] { ${projection} }`);
}

/** Routed document types as a GROQ list. */
const routedDocumentTypes = objectKeys(routes)
  .map((type) => `"${type}"`)
  .join(", ");

/** Every routed document with the fields needed to build its sitemap entry. */
export const sitemapQuery = defineTypedQuery<Nullable<SanityRoutedDocument>[]>(
  `*[_type in [${routedDocumentTypes}]] { _id, _type, _updatedAt, ${routeParamsFragment} }`,
);
