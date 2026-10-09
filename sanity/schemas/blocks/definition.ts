import { IconBook } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { defineArrayMember, defineField } from "sanity";
import type { PortableTextObject } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { DefinitionBlockPreview } from "@/sanity/components/previews/definition";
import type { Strict } from "@/types";

export type SanityDefinition = Strict<PortableTextObject> & {
  _type: "definition";
  term?: string;
  pronunciation?: string;
  wordClass?: string;
  sense?: string;
  origin?: string;
};

export const definition = defineArrayMember({
  name: "definition" satisfies SanityDefinition["_type"],
  type: "object",
  icon: createSanityIcon(IconBook),
  description: "Term set like a dictionary entry.",
  components: { block: DefinitionBlockPreview },
  preview: {
    select: {
      term: "term",
      sense: "sense",
    },
    prepare(selection: { term?: string; sense?: string }) {
      const { term, sense } = selection;

      return {
        title: term ?? "Definition",
        subtitle: sense,
      };
    },
  },
  fields: [
    defineField({
      name: "term" satisfies keyof SanityDefinition,
      type: "string",
      description: "Word or phrase being defined.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pronunciation" satisfies keyof SanityDefinition,
      type: "string",
      description: "Pronunciation of the term in IPA, between slashes.",
    }),
    defineField({
      name: "wordClass" satisfies keyof SanityDefinition,
      type: "string",
      description: "Word class of the term, such as noun or verb.",
    }),
    defineField({
      name: "sense" satisfies keyof SanityDefinition,
      type: "text",
      description: "Meaning of the term.",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "origin" satisfies keyof SanityDefinition,
      type: "string",
      description: "Origin of the term, shown as a caption.",
    }),
  ],
});
