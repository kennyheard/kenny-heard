import { IconFeather } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
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
import type { SanityExtendedPortableText } from "@/sanity/schemas/types/extended-portable-text";
import type { Strict } from "@/types";

export type SanityArticle = Strict<SanityDocument> & { _type: "article" } & SanityTitleField &
  SanitySlugField & {
    date?: string;
    description?: string;
    body?: SanityExtendedPortableText;
  } & SanitySeoFields;

export const article = defineType({
  name: "article" satisfies SanityArticle["_type"],
  type: "document",
  title: "Articles",
  icon: createSanityIcon(IconFeather),
  description: "Writing, listed in the home page's feed with everything else.",
  groups: defineDocumentGroups({ defaultGroup: "content" }),
  orderings: [
    {
      name: "dateDescending",
      title: "Newest First",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
    },
    prepare(selection: { title?: string; date?: string }) {
      const { title, date } = selection;

      return {
        title: title ?? defaultDocumentTitle,
        subtitle: date,
      };
    },
  },
  fields: [
    titleField,
    slugField,
    defineField({
      name: "date" satisfies keyof SanityArticle,
      type: "date",
      group: "properties" satisfies DocumentGroup,
      description: "Date the article was published, which orders it in the feed.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description" satisfies keyof SanityArticle,
      type: "string",
      group: "content" satisfies DocumentGroup,
      description: "One-line summary shown under the title in the feed.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body" satisfies keyof SanityArticle,
      type: "extendedPortableText",
      group: "content" satisfies DocumentGroup,
      description: "Text of the article.",
    }),
    ...seoFields,
  ],
});
