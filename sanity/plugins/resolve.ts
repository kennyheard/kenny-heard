import { defineQuery } from "next-sanity";
import { map } from "rxjs";
import { defineDocuments } from "sanity/presentation";
import type { DocumentLocationResolver } from "sanity/presentation";

import { resolveRoute, routeParamsFragment } from "@/config/links";
import { routes } from "@/config/routes";
import type { SanityRoutedDocument } from "@/config/routes";
import { isDefined, objectEntries } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import { getDocumentDefinition } from "@/sanity/config/documents";
import type { Nullable } from "@/types";

/**
 * Routes mapped to the documents they render, so Presentation opens the right document for a URL. Presentation uses
 * the first route that matches, so fixed paths come before those with parameters.
 */
export const mainDocuments = defineDocuments(
  objectEntries(routes)
    .toSorted(([, first], [, second]) => Number(first.path.includes("[")) - Number(second.path.includes("[")))
    .map(([type, config]) => {
      const params: Record<string, string> = config.params ?? {};
      const route = config.path.replaceAll(/\[(?<param>[^\]]+)\]/gu, ":$<param>");
      const conditions = [
        `_type == "${type}"`,
        ...objectEntries(params).map(([param, expression]) => `${expression} == $${param}`),
      ];

      return { route, filter: defineQuery(conditions.join(" && ")) };
    }),
);

/**
 * Lists the pages where a document appears, either as the page itself or referenced by it.
 *
 * @param params - The document's ID and type.
 * @param context - The Presentation context.
 * @returns A stream of locations, or of null when the document appears on no page.
 */
export function locations(...[params, context]: Parameters<DocumentLocationResolver>) {
  const { id } = params;
  return context.documentStore
    .listenQuery(
      `*[_id == $id || references($id)] { _id, _type, title, ${routeParamsFragment} }`,
      { id },
      { perspective: "drafts" },
    )
    .pipe(
      map((documents: Nullable<SanityRoutedDocument[]>) => {
        const documentLocations = documents?.flatMap((document) => {
          const { _id, _type, title } = document;
          if (!(_type in routes)) return [];

          const href = resolveRoute(document);
          if (!isDefined(href)) return [];

          const documentTitle = title ?? getDocumentDefinition(_type)?.title ?? defaultDocumentTitle;

          return {
            title: id === _id ? `${documentTitle} (this document)` : documentTitle,
            href,
          };
        });

        if (!isDefined(documentLocations)) return null;

        return {
          locations: documentLocations,
          message: "This document appears on these pages:",
        };
      }),
    );
}
