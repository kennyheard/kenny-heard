import { IconParagraph } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { PortableTextLinkPlugins, linkAnnotation } from "@driftime/sanity-plugin-link";
import { defineArrayMember, defineType } from "sanity";
import type { PortableTextTextBlock } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { ImageBlockPreview } from "@/sanity/components/previews/image";
import { ParagraphStyle, SubheadingStyle } from "@/sanity/components/styles";
import { code } from "@/sanity/schemas/blocks/code";
import type { SanityCode } from "@/sanity/schemas/blocks/code";
import { definition } from "@/sanity/schemas/blocks/definition";
import type { SanityDefinition } from "@/sanity/schemas/blocks/definition";
import { quotation } from "@/sanity/schemas/blocks/quotation";
import type { SanityQuotation } from "@/sanity/schemas/blocks/quotation";
import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";
import type { SanityKeyedArray } from "@/sanity/types";

export type SanityExtendedPortableText = SanityKeyedArray<
  PortableTextTextBlock | SanityAccessibleImage | SanityQuotation | SanityDefinition | SanityCode
>;

export const extendedPortableText = defineType({
  name: "extendedPortableText",
  type: "array",
  icon: createSanityIcon(IconParagraph),
  description: "Rich text with subheadings, formatting, lists, links, images, quotations, definitions, and code.",
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
        { title: "Subheading", value: "subheading", component: SubheadingStyle },
      ],
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
    defineArrayMember({
      name: "accessibleImage" satisfies SanityAccessibleImage["_type"],
      type: "accessibleImage",
      components: { block: ImageBlockPreview },
    }),
    quotation,
    definition,
    code,
  ],
});
