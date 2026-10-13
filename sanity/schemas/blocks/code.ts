import { IconCode } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { defineArrayMember, defineField } from "sanity";
import type { PortableTextObject } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { CodeInput } from "@/sanity/components/inputs/code";
import { CodeBlockPreview } from "@/sanity/components/previews/code";
import type { Strict } from "@/types";

export type SanityCode = Strict<PortableTextObject> & {
  _type: "code";
  filename?: string;
  language?: string;
  code?: string;
};

export const code = defineArrayMember({
  name: "code" satisfies SanityCode["_type"],
  type: "object",
  icon: createSanityIcon(IconCode),
  description: "Code with its file name and language.",
  components: { block: CodeBlockPreview },
  preview: {
    select: {
      filename: "filename",
      language: "language",
    },
    prepare(selection: { filename?: string; language?: string }) {
      const { filename, language } = selection;

      return {
        title: filename ?? "Code",
        subtitle: language,
      };
    },
  },
  fields: [
    defineField({
      name: "filename" satisfies keyof SanityCode,
      type: "string",
      description: "Name of the file the code comes from, shown above it.",
    }),
    defineField({
      name: "language" satisfies keyof SanityCode,
      type: "string",
      description: "Language of the code, which sets its highlighting.",
      options: {
        list: [
          { title: "Bash", value: "bash" },
          { title: "CSS", value: "css" },
          { title: "HTML", value: "html" },
          { title: "JavaScript", value: "javascript" },
          { title: "JSON", value: "json" },
          { title: "JSX", value: "jsx" },
          { title: "Markdown", value: "markdown" },
          { title: "Swift", value: "swift" },
          { title: "TSX", value: "tsx" },
          { title: "TypeScript", value: "typescript" },
        ],
      },
    }),
    defineField({
      name: "code" satisfies keyof SanityCode,
      type: "text",
      description: "Code shown in the block.",
      rows: 10,
      components: { input: CodeInput },
      validation: (rule) => rule.required(),
    }),
  ],
});
