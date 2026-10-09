import { IconHammer, IconListBullets, IconToolbox } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { defineArrayMember, defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import { titleField } from "@/sanity/schemas/fields/title";
import type { SanityTitleField } from "@/sanity/schemas/fields/title";
import { seoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanitySeoFields } from "@/sanity/schemas/shared/seo-fields";
import type { SanityKeyedArray } from "@/sanity/types";
import type { Strict } from "@/types";

export type SanityColophon = Strict<SanityDocument> & { _type: "colophon" } & SanityTitleField & {
    introduction?: string;
    sections?: SanityKeyedArray<SanityColophonSection>;
  } & SanitySeoFields;

export interface SanityColophonSection {
  _type: "section";
  label?: string;
  tools?: SanityKeyedArray<SanityColophonTool>;
}

export interface SanityColophonTool {
  _type: "tool";
  name?: string;
  link?: SanityLink;
  description?: string;
}

export const colophon = defineType({
  name: "colophon" satisfies SanityColophon["_type"],
  type: "document",
  title: "Colophon",
  icon: createSanityIcon(IconToolbox),
  description: "Page listing the tools behind the site.",
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
      name: "introduction" satisfies keyof SanityColophon,
      type: "text",
      group: "content" satisfies DocumentGroup,
      description: "Opening line shown below the header.",
      rows: 2,
    }),
    defineField({
      name: "sections" satisfies keyof SanityColophon,
      type: "array",
      group: "content" satisfies DocumentGroup,
      description: "Groups of tools, each under its own label.",
      of: [
        defineArrayMember({
          name: "section" satisfies SanityColophonSection["_type"],
          type: "object",
          icon: createSanityIcon(IconListBullets),
          preview: {
            select: {
              label: "label",
              tools: "tools",
            },
            prepare(selection: { label?: string; tools?: SanityColophonTool[] }) {
              const { label, tools } = selection;
              const count = tools?.length ?? 0;

              return {
                title: label ?? "Section",
                subtitle: count === 1 ? "1 tool" : `${count} tools`,
              };
            },
          },
          fields: [
            defineField({
              name: "label" satisfies keyof SanityColophonSection,
              type: "string",
              description: "Label for the group, such as Design or Hosting.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tools" satisfies keyof SanityColophonSection,
              type: "array",
              description: "Tools in the group.",
              of: [
                defineArrayMember({
                  name: "tool" satisfies SanityColophonTool["_type"],
                  type: "object",
                  icon: createSanityIcon(IconHammer),
                  preview: {
                    select: {
                      name: "name",
                      description: "description",
                    },
                    prepare(selection: { name?: string; description?: string }) {
                      const { name, description } = selection;

                      return {
                        title: name ?? "Tool",
                        subtitle: description,
                      };
                    },
                  },
                  fields: [
                    defineField({
                      name: "name" satisfies keyof SanityColophonTool,
                      type: "string",
                      description: "Name of the tool.",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "link" satisfies keyof SanityColophonTool,
                      type: "link",
                      description: "Website of the tool.",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "description" satisfies keyof SanityColophonTool,
                      type: "string",
                      description: "One-line summary of what the tool does here.",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    ...seoFields,
  ],
});
