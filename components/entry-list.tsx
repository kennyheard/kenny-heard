import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export type EntryListProps = ComponentProps<"div"> & VariantProps<typeof variants>;

export const variants = tv({
  base: "flex flex-col gap-12 md:gap-16",
});

export function EntryList({ className, ...props }: EntryListProps) {
  return <div className={variants({ className })} {...props} />;
}
