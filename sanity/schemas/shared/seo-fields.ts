import { defineField } from "sanity";

import type { DocumentGroup } from "@/sanity/config/groups";

export interface SanitySeoFields {
  seoTitle?: string;
  seoDescription?: string;
}

export const seoFields = [
  defineField({
    name: "seoTitle" satisfies keyof SanitySeoFields,
    type: "string",
    title: "SEO Title",
    group: "seo" satisfies DocumentGroup,
    description: "Title for search results and social previews, if different from the page title.",
  }),
  defineField({
    name: "seoDescription" satisfies keyof SanitySeoFields,
    type: "text",
    title: "SEO Description",
    group: "seo" satisfies DocumentGroup,
    description: "Summary for search results and social previews.",
  }),
];
