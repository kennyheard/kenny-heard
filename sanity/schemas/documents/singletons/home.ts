import { HouseIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import { titleField } from "@/sanity/schemas/fields/title";
import type { SanityTitleField } from "@/sanity/schemas/fields/title";
import { seoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanitySeoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";
import type { SanityMinimalPortableText } from "@/sanity/schemas/types/minimal-portable-text";
import type { Strict } from "@/types";

export type SanityHome = Strict<SanityDocument> & {
  _type: "home";
  heading?: string;
  introduction?: SanityMinimalPortableText;
  image?: SanityAccessibleImage;
} & SanityTitleField &
  SanitySeoFields;

export const home = defineType({
  name: "home" satisfies SanityHome["_type"],
  type: "document",
  title: "Home",
  icon: createSanityIcon(HouseIcon),
  description: "Landing page of the site.",
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
    defineField({
      name: "heading" satisfies keyof SanityHome,
      type: "string",
      group: "content" satisfies DocumentGroup,
      description: "Heading at the top of the page, if different from the title.",
    }),
    defineField({
      name: "introduction" satisfies keyof SanityHome,
      type: "minimalPortableText",
      group: "content" satisfies DocumentGroup,
      description: "Short introduction shown below the heading.",
    }),
    defineField({
      name: "image" satisfies keyof SanityHome,
      type: "accessibleImage",
      group: "content" satisfies DocumentGroup,
      description: "Image shown below the introduction.",
    }),
    ...seoFields,
  ],
});
