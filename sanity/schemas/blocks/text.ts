import { PilcrowIcon } from "lucide-react";
import { defineArrayMember, defineField } from "sanity";
import type { PortableTextObject } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import type { SanityStandardPortableText } from "@/sanity/schemas/types/standard-portable-text";
import type { Strict } from "@/types";

export type SanityTextBlock = Strict<PortableTextObject> & {
  _type: "textBlock";
  heading?: string;
  body?: SanityStandardPortableText;
};

export const textBlock = defineArrayMember({
  name: "textBlock" satisfies SanityTextBlock["_type"],
  type: "object",
  title: "Text",
  icon: createSanityIcon(PilcrowIcon),
  description: "Heading and formatted text.",
  preview: {
    select: {
      heading: "heading",
      subtitle: "body[0].children[0].text",
    },
    prepare(selection: { heading?: string; subtitle?: string }) {
      const { heading, subtitle } = selection;

      return {
        title: heading ?? "Text",
        subtitle,
      };
    },
  },
  fields: [
    defineField({
      name: "heading" satisfies keyof SanityTextBlock,
      type: "string",
      description: "Heading shown above the text.",
    }),
    defineField({
      name: "body" satisfies keyof SanityTextBlock,
      type: "standardPortableText",
      description: "Formatted text.",
    }),
  ],
});
