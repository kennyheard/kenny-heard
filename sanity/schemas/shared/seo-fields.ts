import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import { defineField } from "sanity";

import { socialImageIconStyle } from "@/config/icons";
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
    description:
      "Icon drawn as a metal sign on a wall in the page's social preview image, if different from the page's own icon. Choose a bold shape without fine details.",
    options: { library: "central", style: socialImageIconStyle },
  }),
];
