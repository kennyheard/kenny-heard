import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import { defineField } from "sanity";

import type { DocumentGroup } from "@/sanity/config/groups";

export interface SanitySeoFields {
  seoTitle?: string;
  seoDescription?: string;
  seoIcon?: SanityIcon;
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
  defineField({
    name: "seoIcon" satisfies keyof SanitySeoFields,
    type: "icon",
    title: "SEO Icon",
    group: "seo" satisfies DocumentGroup,
    description: "Icon shown alone in the middle of the page's social preview image.",
    options: { library: "central", style: "round-outlined-radius-2-stroke-1" },
    validation: (rule) => rule.required(),
  }),
];
