import { IconHomeOpen, IconProgressArc } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { createIconPreview } from "@driftime/sanity-plugin-icon";
import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import { defineArrayMember, defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import { iconField } from "@/sanity/schemas/fields/icon";
import type { SanityIconField } from "@/sanity/schemas/fields/icon";
import { titleField } from "@/sanity/schemas/fields/title";
import type { SanityTitleField } from "@/sanity/schemas/fields/title";
import { seoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanitySeoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanityMinimalPortableText } from "@/sanity/schemas/types/minimal-portable-text";
import type { SanityKeyedArray } from "@/sanity/types";
import type { Strict } from "@/types";

export type SanityHome = Strict<SanityDocument> & { _type: "home" } & SanityTitleField & {
    introduction?: string;
    now?: SanityKeyedArray<SanityHomeWork>;
    endNote?: SanityHomeEndNote;
  } & SanitySeoFields;

export type SanityHomeWork = { _type: "work" } & SanityIconField & {
    title?: string;
    description?: string;
  };

export interface SanityHomeEndNote {
  heading?: string;
  body?: SanityMinimalPortableText;
}

export const home = defineType({
  name: "home" satisfies SanityHome["_type"],
  type: "document",
  title: "Home",
  icon: createSanityIcon(IconHomeOpen),
  description: "Landing page of the site, with the feed of articles and entries.",
  groups: defineDocumentGroups({ defaultGroup: "content" }),
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
      name: "introduction" satisfies keyof SanityHome,
      type: "text",
      group: "content" satisfies DocumentGroup,
      description: "Opening line shown below the header.",
      rows: 2,
    }),
    defineField({
      name: "now" satisfies keyof SanityHome,
      type: "array",
      group: "content" satisfies DocumentGroup,
      description: "Current work, shown above the feed. Keep each one general enough not to go stale.",
      of: [
        defineArrayMember({
          name: "work" satisfies SanityHomeWork["_type"],
          type: "object",
          icon: createSanityIcon(IconProgressArc),
          preview: {
            select: {
              icon: "icon",
              title: "title",
              description: "description",
            },
            prepare(selection: { icon?: SanityIcon; title?: string; description?: string }) {
              const { icon, title, description } = selection;

              return {
                title: title ?? "Work",
                subtitle: description,
                media: createIconPreview(icon),
              };
            },
          },
          fields: [
            iconField,
            defineField({
              name: "title" satisfies keyof SanityHomeWork,
              type: "string",
              description: "Name of the work.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description" satisfies keyof SanityHomeWork,
              type: "string",
              description: "One-line summary shown under the name.",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "endNote" satisfies keyof SanityHome,
      type: "object",
      group: "content" satisfies DocumentGroup,
      description: "Note shown at the end of the feed, once there's nothing left to load.",
      fields: [
        defineField({
          name: "heading" satisfies keyof SanityHomeEndNote,
          type: "string",
          description: "Heading of the note.",
        }),
        defineField({
          name: "body" satisfies keyof SanityHomeEndNote,
          type: "minimalPortableText",
          description: "Text of the note.",
        }),
      ],
    }),
    ...seoFields,
  ],
});
