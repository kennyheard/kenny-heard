import { PortableTextLinkPlugins, linkAnnotation } from "@driftime/sanity-plugin-link";
import { TextInitialIcon } from "lucide-react";
import { defineArrayMember, defineType } from "sanity";
import type { ArrayDefinition, ArrayOptions, PortableTextTextBlock } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { MinimalPortableText } from "@/sanity/components/inputs/minimal-portable-text";
import { ParagraphStyle } from "@/sanity/components/styles";
import type { SanityKeyedArray } from "@/sanity/types";

declare module "sanity" {
  export interface IntrinsicDefinitions {
    minimalPortableText: Omit<ArrayDefinition, "type" | "of" | "options"> & {
      type: "minimalPortableText";
      options?: ArrayOptions & {
        /** Editor height in pixels, outside fullscreen. */
        editorHeight?: number;
      };
    };
  }
}

export type SanityMinimalPortableText = SanityKeyedArray<PortableTextTextBlock>;

export const minimalPortableText = defineType({
  name: "minimalPortableText",
  type: "array",
  icon: createSanityIcon(TextInitialIcon),
  description: "Rich text limited to bold, italic, and links.",
  components: {
    input: MinimalPortableText,
    portableText: {
      plugins: PortableTextLinkPlugins,
    },
  },
  of: [
    defineArrayMember({
      name: "block",
      type: "block",
      styles: [{ title: "Paragraph", value: "normal", component: ParagraphStyle }],
      lists: [],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
});
