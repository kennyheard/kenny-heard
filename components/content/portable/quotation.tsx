import { IconOpenQuote1 } from "@central-icons-react/round-filled-radius-2-stroke-1";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Icon } from "@/components/icon";
import { isDefined } from "@/lib/utils";
import type { SanityQuotation } from "@/sanity/schemas/blocks/quotation";

export type PortableQuotationProps = Omit<ComponentProps<"figure">, "children"> &
  VariantProps<typeof variants> & {
    value: SanityQuotation;
  };

export const variants = tv({
  base: "flex flex-col gap-4 md:my-6",
});

export function PortableQuotation({ value, className, ...props }: PortableQuotationProps) {
  const { quote, attribution } = value;

  return (
    <figure className={variants({ className })} {...props}>
      <Icon value={IconOpenQuote1} size="2.5rem" tone="faint" />
      <blockquote className="font-quote text-balance">{quote}</blockquote>
      {isDefined(attribution) && <figcaption className="font-meta text-muted">{attribution}</figcaption>}
    </figure>
  );
}
