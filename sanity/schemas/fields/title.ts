import { defineField } from "sanity";

import type { DocumentGroup } from "@/sanity/config/groups";

export interface SanityTitleField {
  title?: string;
}

export const titleField = defineField({
  name: "title" satisfies keyof SanityTitleField,
  type: "string",
  group: "properties" satisfies DocumentGroup,
  description: "Name shown in navigation, browser tabs, and search results.",
  validation: (rule) => rule.required(),
});
