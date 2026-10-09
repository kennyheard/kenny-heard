import { FileIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import { slugField } from "@/sanity/schemas/fields/slug";
import type { SanitySlugField } from "@/sanity/schemas/fields/slug";
import { titleField } from "@/sanity/schemas/fields/title";
import type { SanityTitleField } from "@/sanity/schemas/fields/title";
import { seoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanitySeoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanityContent } from "@/sanity/schemas/types/content";
import type { Strict } from "@/types";

export type SanityPage = Strict<SanityDocument> & {
  _type: "page";
  heading?: string;
  description?: string;
  content?: SanityContent;
} & SanityTitleField &
  SanitySlugField &
  SanitySeoFields;

export const page = defineType({
  name: "page" satisfies SanityPage["_type"],
  type: "document",
  title: "Pages",
  icon: createSanityIcon(FileIcon),
  description: "General-purpose pages.",
  groups: defineDocumentGroups({ defaultGroup: "properties" }),
  preview: {
    select: {
      title: "title",
    },
    prepare(selection: { title?: string }) {
      const { title } = selection;

      return {
        title: title ?? defaultDocumentTitle,
      };
    },
  },
  fields: [
    titleField,
    slugField,
    defineField({
      name: "heading" satisfies keyof SanityPage,
      type: "string",
      group: "content" satisfies DocumentGroup,
      description: "Heading at the top of the page, if different from the title.",
    }),
    defineField({
      name: "description" satisfies keyof SanityPage,
      type: "text",
      group: "content" satisfies DocumentGroup,
      description: "Short introduction shown below the heading.",
      rows: 4,
    }),
    defineField({
      name: "content" satisfies keyof SanityPage,
      type: "content",
      group: "content" satisfies DocumentGroup,
      description: "Content blocks that make up the page.",
    }),
    ...seoFields,
  ],
});
