import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { isDefined } from "@/lib/utils";

export type RowProps = ComponentProps<"div"> &
  VariantProps<typeof variants> & {
    label?: string;
    headingLevel?: 1 | 2;
  };

export const variants = tv({
  base: "flex flex-col gap-6 md:grid md:grid-cols-[--spacing(32)_1fr] md:gap-0",
});

export function Row({ label, headingLevel = 2, className, children, ...props }: RowProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className={variants({ className })} {...props}>
      {isDefined(label) && <Heading className="font-meta text-muted md:mt-1.25">{label}</Heading>}
      <div className="flex flex-col gap-12 md:col-start-2 md:gap-16">{children}</div>
    </div>
  );
}
