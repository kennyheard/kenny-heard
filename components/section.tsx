import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export type SectionProps = ComponentProps<"section"> & VariantProps<typeof variants>;

export const variants = tv({
  variants: {
    type: {
      introduction: "pt-12 md:pt-16",
      content: "pt-16 md:pt-24",
    },
  },
  defaultVariants: {
    type: "content",
  },
});

export function Section({ type, className, children, ...props }: SectionProps) {
  return (
    <section className={variants({ type, className })} {...props}>
      {children}
    </section>
  );
}
