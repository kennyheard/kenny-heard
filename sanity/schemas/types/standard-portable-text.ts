import { IconParagraph } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { PortableTextLinkPlugins, linkAnnotation } from "@driftime/sanity-plugin-link";
import { defineArrayMember, defineType } from "sanity";
import type { PortableTextTextBlock } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { ParagraphStyle } from "@/sanity/components/styles";
import type { SanityKeyedArray } from "@/sanity/types";

export type SanityStandardPortableText = SanityKeyedArray<PortableTextTextBlock>;

export const standardPortableText = defineType({
  name: "standardPortableText",
  type: "array",
  icon: createSanityIcon(IconParagraph),
  description: "Rich text with bold, italic, code, lists, and links.",
  components: {
    portableText: {
      plugins: PortableTextLinkPlugins,
    },
  },
  of: [
    defineArrayMember({
      name: "block",
      type: "block",
      styles: [{ title: "Paragraph", value: "normal", component: ParagraphStyle }],
      lists: [
        { title: "Bulleted List", value: "bullet" },
        { title: "Numbered List", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
});
