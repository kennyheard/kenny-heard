import { TextBlock } from "@/components/content/blocks/text";
import { isDefined } from "@/lib/utils";
import type { SanityContent } from "@/sanity/schemas/types/content";

export interface ContentProps {
  content?: SanityContent;
}

export function Content({ content }: ContentProps) {
  return content
    ?.filter((block) => isDefined(block))
    .flatMap((block) => {
      switch (block._type) {
        // oxlint-disable-next-line no-unnecessary-condition -- Additional block types will be added.
        case "textBlock": {
          return <TextBlock key={block._key} block={block} />;
        }
        default: {
          return [];
        }
      }
    });
}
