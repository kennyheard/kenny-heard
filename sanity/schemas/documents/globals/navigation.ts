import { CompassIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import type { SanityNavigationMenu } from "@/sanity/schemas/types/navigation-menu";
import type { Strict } from "@/types";

export type SanityNavigation = Strict<SanityDocument> & {
  _type: "navigation";
} & SanityNavigationMenus;

export interface SanityNavigationMenus {
  header?: SanityNavigationMenu;
}

export const navigation = defineType({
  name: "navigation" satisfies SanityNavigation["_type"],
  type: "document",
  title: "Navigation",
  icon: createSanityIcon(CompassIcon),
  description: "Navigation menus shown across the site.",
  groups: defineDocumentGroups({ defaultGroup: "header" }),
  preview: {
    prepare() {
      return {
        title: "Navigation",
      };
    },
  },
  fields: [
    defineField({
      name: "header" satisfies keyof SanityNavigation,
      type: "navigationMenu",
      group: "header" satisfies DocumentGroup,
      description: "Menu at the top of every page.",
    }),
  ],
});
