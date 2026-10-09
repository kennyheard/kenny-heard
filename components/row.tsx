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
  base: "flex flex-col gap-6 md:flex-row md:gap-0",
});

export function Row({ label, headingLevel = 2, className, children, ...props }: RowProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className={variants({ className })} {...props}>
      {isDefined(label) ? (
        <Heading className="font-meta text-muted md:mt-1.25 md:w-32 md:shrink-0">{label}</Heading>
      ) : (
        <div className="hidden md:block md:w-32 md:shrink-0" />
      )}
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
