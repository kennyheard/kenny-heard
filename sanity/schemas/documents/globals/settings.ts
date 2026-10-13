import { IconSettingsToggle1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { site } from "@/config/metadata";
import { createSanityIcon } from "@/lib/icons";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import type { SanityMinimalPortableText } from "@/sanity/schemas/types/minimal-portable-text";
import type { Strict } from "@/types";

export type SanitySettings = Strict<SanityDocument> & {
  _type: "settings";
  name?: string;
  profession?: SanityMinimalPortableText;
} & SanitySeoSettings;

export interface SanitySeoSettings {
  seoTitle?: string;
  seoSuffix?: string;
  seoDescription?: string;
}

export const settings = defineType({
  name: "settings" satisfies SanitySettings["_type"],
  type: "document",
  title: "Settings",
  icon: createSanityIcon(IconSettingsToggle1),
  description: "Your name and profession, and site-wide SEO values for pages that don't set their own.",
  groups: defineDocumentGroups({ defaultGroup: "header" }),
  preview: {
    prepare() {
      return {
        title: "Settings",
      };
    },
  },
  fields: [
    defineField({
      name: "name" satisfies keyof SanitySettings,
      type: "string",
      group: "header" satisfies DocumentGroup,
      description: "Your name, shown at the top of every page.",
    }),
    defineField({
      name: "profession" satisfies keyof SanitySettings,
      type: "minimalPortableText",
      group: "header" satisfies DocumentGroup,
      description:
        "Job title and employer shown under your name at the top of every page. Link the employer's name to its website.",
    }),
    defineField({
      name: "seoTitle" satisfies keyof SanitySettings,
      type: "string",
      title: "SEO Title",
      group: "seo" satisfies DocumentGroup,
      description: `Title for search results and social previews on pages without one. Leave empty to use “${site.title}”.`,
    }),
    defineField({
      name: "seoSuffix" satisfies keyof SanitySettings,
      type: "string",
      title: "SEO Suffix",
      group: "seo" satisfies DocumentGroup,
      description: `Text added after every page title. Leave empty to use “${site.suffix}”.`,
    }),
    defineField({
      name: "seoDescription" satisfies keyof SanitySettings,
      type: "text",
      title: "SEO Description",
      group: "seo" satisfies DocumentGroup,
      description: `Summary for search results and social previews on pages without one. Leave empty to use “${site.description}”.`,
      rows: 4,
    }),
  ],
});
