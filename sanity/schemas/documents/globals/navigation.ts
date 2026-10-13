import { IconCompassRound, IconGlobe } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { createIconPreview } from "@driftime/sanity-plugin-icon";
import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { defineArrayMember, defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { isDefined } from "@/lib/utils";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import type { SanityNavigationMenu } from "@/sanity/schemas/types/navigation-menu";
import type { SanityKeyedArray } from "@/sanity/types";
import type { Strict } from "@/types";

export type SanityNavigation = Strict<SanityDocument> & {
  _type: "navigation";
} & SanityNavigationMenus;

export interface SanityNavigationMenus {
  footer?: SanityNavigationMenu;
  social?: SanityKeyedArray<SanitySocialLink>;
}

export interface SanitySocialLink {
  _type: "socialLink";
  link?: SanityLink;
  icon?: SanityIcon;
}

export const navigation = defineType({
  name: "navigation" satisfies SanityNavigation["_type"],
  type: "document",
  title: "Navigation",
  icon: createSanityIcon(IconCompassRound),
  description: "Navigation menus shown across the site.",
  groups: defineDocumentGroups({ defaultGroup: "footer" }),
  preview: {
    prepare() {
      return {
        title: "Navigation",
      };
    },
  },
  fields: [
    defineField({
      name: "footer" satisfies keyof SanityNavigation,
      type: "navigationMenu",
      group: "footer" satisfies DocumentGroup,
      description: "Text links at the bottom of every page.",
    }),
    defineField({
      name: "social" satisfies keyof SanityNavigation,
      type: "array",
      group: "footer" satisfies DocumentGroup,
      description: "Icon links to other places to find you, beside the footer's text links.",
      of: [
        defineArrayMember({
          name: "socialLink" satisfies SanitySocialLink["_type"],
          type: "object",
          icon: createSanityIcon(IconGlobe),
          preview: {
            select: {
              label: "link.label",
              url: "link.url",
              email: "link.email",
              icon: "icon",
            },
            prepare(selection: { label?: string; url?: string; email?: string; icon?: SanityIcon }) {
              const { label, url, email, icon } = selection;

              return {
                title: label ?? url ?? email ?? "Social Link",
                media: createIconPreview(icon),
              };
            },
          },
          fields: [
            defineField({
              name: "link" satisfies keyof SanitySocialLink,
              type: "link",
              description: "Destination of the link. Its label is read out by screen readers in place of the icon.",
              options: { destinations: ["url", "email"] },
              validation: (rule) =>
                rule
                  .required()
                  .custom(
                    (link: SanityLink | undefined) =>
                      isDefined(link?.label) || "Add a label, which screen readers read out in place of the icon.",
                  ),
            }),
            defineField({
              name: "icon" satisfies keyof SanitySocialLink,
              type: "icon",
              description: "Icon shown for the link.",
              options: {
                library: "central",
                style: "round-outlined-radius-2-stroke-1",
                icons: ["x", "github", "paper-plane-top-right"],
              },
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
});
