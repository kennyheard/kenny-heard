import type { SlugValue, ValidationContext } from "sanity";

import { routes } from "@/config/routes";
import { isDefined, objectValues } from "@/lib/utils";
import { studioUrl } from "@/sanity/lib/api";

/**
 * Checks that a slug contains only lowercase letters, numbers, and hyphens.
 *
 * @param slug - The slug to check.
 * @returns `true` for a valid slug, otherwise a message saying what's wrong.
 */
export function validateSlug(slug: SlugValue | undefined) {
  const { current } = slug ?? {};
  if (!isDefined(current)) return true;

  return /^[a-z0-9-]+$/u.test(current) || "Use lowercase letters, numbers, and hyphens only.";
}

/**
 * Checks that a page's slug doesn't take an address the site already uses, such as another route or the Studio, where
 * the page could never be reached.
 *
 * @param slug - The slug to check.
 * @param context - Context of the document being edited.
 * @returns `true` when the address is free, otherwise a message saying what's wrong.
 */
export function validatePageSlug(slug: SlugValue | undefined, context: ValidationContext) {
  const { current } = slug ?? {};
  if (!isDefined(current) || context.document?._type !== "page") return true;

  const reserved = [...objectValues(routes).map(({ path }) => path.split("/")[1]), studioUrl.slice(1), "api"];

  return (
    !reserved.includes(current) || "This address is already used by another part of the site. Choose a different slug."
  );
}
