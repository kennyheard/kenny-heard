import { defineField } from "sanity";

import type { DocumentGroup } from "@/sanity/config/groups";
import type { SanityImage } from "@/sanity/types";

export interface SanitySeoFields {
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: SanityImage;
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
    name: "seoImage" satisfies keyof SanitySeoFields,
    type: "image",
    title: "SEO Image",
    group: "seo" satisfies DocumentGroup,
    description:
      "Image for social previews, if different from the site-wide one. Upload a PNG or JPEG, ideally 1200 × 630 pixels.",
    options: {
      accept: "image/png, image/jpeg",
    },
  }),
];
