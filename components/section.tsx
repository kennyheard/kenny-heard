import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export type SectionProps = ComponentProps<"section"> & VariantProps<typeof variants>;

export const variants = tv({
  base: "px-6 py-12 md:px-8 md:py-16",
});

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={variants({ className })} {...props}>
      {children}
    </section>
  );
}
