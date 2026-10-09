import { IconBlocks } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { defineType } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { textBlock } from "@/sanity/schemas/blocks/text";
import type { SanityTextBlock } from "@/sanity/schemas/blocks/text";
import type { SanityKeyedArray } from "@/sanity/types";

export type SanityAnyBlock = SanityTextBlock;

export type SanityContent = SanityKeyedArray<SanityAnyBlock>;

export const content = defineType({
  name: "content",
  type: "array",
  icon: createSanityIcon(IconBlocks),
  description: "Content blocks, shown in order from top to bottom.",
  of: [textBlock],
});
