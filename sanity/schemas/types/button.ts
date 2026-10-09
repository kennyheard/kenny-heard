import { IconCursorClick } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { defineField, defineType } from "sanity";

import type { ButtonProps } from "@/components/button";
import { variants as buttonVariants } from "@/components/button";
import { createSanityIcon } from "@/lib/icons";
import { convertCase, isDefined, objectKeys } from "@/lib/utils";

export interface SanityButton {
  _type: "button";
  link?: SanityLink;
  theme?: ButtonProps["theme"];
}

export const button = defineType({
  name: "button" satisfies SanityButton["_type"],
  type: "object",
  icon: createSanityIcon(IconCursorClick),
  description: "Button linking to a page, file, or another site.",
  preview: {
    select: {
      label: "link.label",
      title: "link.reference.title",
      theme: "theme",
    },
    prepare(selection: { label?: string; title?: string; theme?: ButtonProps["theme"] }) {
      const { label, title, theme } = selection;

      return {
        title: label ?? title ?? "Button",
        subtitle: isDefined(theme) ? convertCase(theme, "title") : undefined,
      };
    },
  },
  fields: [
    defineField({
      name: "link" satisfies keyof SanityButton,
      type: "link",
      description: "Destination of the button.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "theme" satisfies keyof SanityButton,
      type: "string",
      description: "Visual style of the button.",
      initialValue: buttonVariants.defaultVariants.theme,
      options: {
        list: objectKeys(buttonVariants.variants.theme).map((theme) => ({
          title: convertCase(theme, "title"),
          value: theme,
        })),
      },
    }),
  ],
});
