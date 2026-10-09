import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export type RowListProps = ComponentProps<"div"> & VariantProps<typeof variants>;

export const variants = tv({
  base: "flex flex-col gap-18 md:gap-24",
});

export function RowList({ className, ...props }: RowListProps) {
  return <div className={variants({ className })} {...props} />;
}
