import { defineField } from "sanity";
import type { Slug } from "sanity";

import type { DocumentGroup } from "@/sanity/config/groups";
import { validateSlug } from "@/sanity/lib/validation";

export interface SanityIdField {
  id?: Slug;
}

export const idField = defineField({
  name: "id" satisfies keyof SanityIdField,
  type: "slug",
  group: "properties" satisfies DocumentGroup,
  title: "ID",
  description: "Unique identifier for sorting and queries. Use lowercase letters, numbers, and hyphens only.",
  options: { source: "title" },
  validation: (rule) => rule.required().custom(validateSlug),
});
