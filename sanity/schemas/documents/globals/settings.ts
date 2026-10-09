import { IconSettingsToggle1 } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { site } from "@/config/metadata";
import { createSanityIcon } from "@/lib/icons";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import type { SanityImage } from "@/sanity/types";
import type { Strict } from "@/types";

export type SanitySettings = Strict<SanityDocument> & {
  _type: "settings";
} & SanitySeoSettings;

export interface SanitySeoSettings {
  seoTitle?: string;
  seoSuffix?: string;
  seoDescription?: string;
  seoImage?: SanityImage;
}

export const settings = defineType({
  name: "settings" satisfies SanitySettings["_type"],
  type: "document",
  title: "Settings",
  icon: createSanityIcon(IconSettingsToggle1),
  description: "Site-wide SEO values for pages that don't set their own.",
  groups: defineDocumentGroups({ defaultGroup: "seo" }),
  preview: {
    prepare() {
      return {
        title: "Settings",
      };
    },
  },
  fields: [
    defineField({
      name: "seoTitle" satisfies keyof SanitySettings,
      type: "string",
      title: "SEO Title",
      group: "seo" satisfies DocumentGroup,
      description: `Title for search results and social previews on pages without one. Leave empty to use ‘${site.name}’.`,
    }),
    defineField({
      name: "seoSuffix" satisfies keyof SanitySettings,
      type: "string",
      title: "SEO Suffix",
      group: "seo" satisfies DocumentGroup,
      description: `Text added after every page title. Leave empty to use ‘${site.suffix}’.`,
    }),
    defineField({
      name: "seoDescription" satisfies keyof SanitySettings,
      type: "text",
      title: "SEO Description",
      group: "seo" satisfies DocumentGroup,
      description: `Summary for search results and social previews on pages without one. Leave empty to use ‘${site.description}’.`,
      rows: 4,
    }),
    defineField({
      name: "seoImage" satisfies keyof SanitySettings,
      type: "image",
      title: "SEO Image",
      group: "seo" satisfies DocumentGroup,
      description: "Image for social previews on pages without one. Upload a PNG or JPEG, ideally 1200 × 630 pixels.",
      options: {
        accept: "image/png, image/jpeg",
      },
    }),
  ],
});
