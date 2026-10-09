import type { SlugValue } from "sanity";

import { isDefined } from "@/lib/utils";

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
