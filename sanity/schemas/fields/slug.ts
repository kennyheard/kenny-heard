import { defineField } from "sanity";
import type { Slug } from "sanity";

import type { DocumentGroup } from "@/sanity/config/groups";
import { validatePageSlug, validateSlug } from "@/sanity/lib/validation";

export interface SanitySlugField {
  slug?: Slug;
}

export const slugField = defineField({
  name: "slug" satisfies keyof SanitySlugField,
  type: "slug",
  group: "properties" satisfies DocumentGroup,
  description: "Part of the web address that identifies the page. Use lowercase letters, numbers, and hyphens only.",
  options: { source: "title" },
  validation: (rule) => rule.required().custom(validateSlug).custom(validatePageSlug),
});
