import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { PortableText } from "@/components/content/portable-text";
import { isDefined } from "@/lib/utils";
import type { SanityTextBlock } from "@/sanity/schemas/blocks/text";

export type TextBlockProps = ComponentProps<"div"> &
  VariantProps<typeof variants> & {
    block: SanityTextBlock;
  };

export const variants = tv({
  base: "flex flex-col gap-y-4",
});

export function TextBlock({ block, className, ...props }: TextBlockProps) {
  const { heading, body } = block;

  return (
    <div className={variants({ className })} {...props}>
      {isDefined(heading) && <h2>{heading}</h2>}
      {isDefined(body) && <PortableText value={body} />}
    </div>
  );
}
