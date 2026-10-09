import { IconLayoutTop } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import type { Strict } from "@/types";

export type SanityTemplates = Strict<SanityDocument> & {
  _type: "templates";
} & SanityFooterTemplate;

export interface SanityFooterTemplate {
  attribution?: string;
}

export const templates = defineType({
  name: "templates" satisfies SanityTemplates["_type"],
  type: "document",
  title: "Templates",
  icon: createSanityIcon(IconLayoutTop),
  description: "Text that appears in the same place on every page.",
  groups: defineDocumentGroups({ defaultGroup: "footer" }),
  preview: {
    prepare() {
      return {
        title: "Templates",
      };
    },
  },
  fields: [
    defineField({
      name: "attribution" satisfies keyof SanityTemplates,
      type: "string",
      group: "footer" satisfies DocumentGroup,
      description: "Credit or copyright line in the footer.",
    }),
  ],
});
