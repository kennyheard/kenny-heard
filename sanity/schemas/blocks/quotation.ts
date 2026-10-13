import { IconOpenQuote1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { defineArrayMember, defineField } from "sanity";
import type { PortableTextObject } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { QuotationBlockPreview } from "@/sanity/components/previews/quotation";
import type { Strict } from "@/types";

export type SanityQuotation = Strict<PortableTextObject> & {
  _type: "quotation";
  quote?: string;
  attribution?: string;
};

export const quotation = defineArrayMember({
  name: "quotation" satisfies SanityQuotation["_type"],
  type: "object",
  icon: createSanityIcon(IconOpenQuote1),
  description: "Someone else's words, with the name of the person quoted.",
  components: { block: QuotationBlockPreview },
  preview: {
    select: {
      quote: "quote",
      attribution: "attribution",
    },
    prepare(selection: { quote?: string; attribution?: string }) {
      const { quote, attribution } = selection;

      return {
        title: quote ?? "Quotation",
        subtitle: attribution,
      };
    },
  },
  fields: [
    defineField({
      name: "quote" satisfies keyof SanityQuotation,
      type: "text",
      description: "Words being quoted, without quotation marks.",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution" satisfies keyof SanityQuotation,
      type: "string",
      description: "Name of the person quoted.",
      validation: (rule) => rule.required(),
    }),
  ],
});
