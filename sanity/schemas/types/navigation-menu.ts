import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { CompassIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import type { SanityKeyedArray } from "@/sanity/types";

export interface SanityNavigationMenu {
  _type: "navigationMenu";
  links?: SanityKeyedArray<SanityLink>;
  name?: string;
}

export const navigationMenu = defineType({
  name: "navigationMenu" satisfies SanityNavigationMenu["_type"],
  type: "object",
  icon: createSanityIcon(CompassIcon),
  description: "Set of navigation links.",
  preview: {
    select: {
      links: "links",
      name: "name",
    },
    prepare(selection: { links?: SanityLink[]; name?: string }) {
      const { links, name } = selection;
      const count = links?.length ?? 0;

      return {
        title: name ?? "Navigation Menu",
        subtitle: count === 1 ? "1 link" : `${count} links`,
      };
    },
  },
  fields: [
    defineField({
      name: "links" satisfies keyof SanityNavigationMenu,
      type: "array",
      description: "Links in the menu.",
      of: [
        defineArrayMember({
          name: "link" satisfies SanityLink["_type"],
          type: "link",
        }),
      ],
    }),
    defineField({
      name: "name" satisfies keyof SanityNavigationMenu,
      type: "string",
      description: "Name of the menu, read out by screen readers.",
      validation: (rule) => rule.required(),
    }),
  ],
});
