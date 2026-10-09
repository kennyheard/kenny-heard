import { PortableTextLinkPlugins, linkAnnotation } from "@driftime/sanity-plugin-link";
import { TextInitialIcon } from "lucide-react";
import { defineArrayMember, defineType } from "sanity";
import type { PortableTextTextBlock } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import {
  Heading2Style,
  Heading3Style,
  Heading4Style,
  Heading5Style,
  Heading6Style,
  ParagraphStyle,
} from "@/sanity/components/styles";
import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";
import type { SanityKeyedArray } from "@/sanity/types";

export type SanityExtendedPortableText = SanityKeyedArray<PortableTextTextBlock | SanityAccessibleImage>;

export const extendedPortableText = defineType({
  name: "extendedPortableText",
  type: "array",
  icon: createSanityIcon(TextInitialIcon),
  description: "Rich text with formatting, headings, lists, links, and images.",
  components: {
    portableText: {
      plugins: PortableTextLinkPlugins,
    },
  },
  of: [
    defineArrayMember({
      name: "block",
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal", component: ParagraphStyle },
        { title: "Heading 2", value: "h2", component: Heading2Style },
        { title: "Heading 3", value: "h3", component: Heading3Style },
        { title: "Heading 4", value: "h4", component: Heading4Style },
        { title: "Heading 5", value: "h5", component: Heading5Style },
        { title: "Heading 6", value: "h6", component: Heading6Style },
      ],
      marks: {
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({
      name: "accessibleImage" satisfies SanityAccessibleImage["_type"],
      type: "accessibleImage",
    }),
  ],
});
