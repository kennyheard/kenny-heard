import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof variants>;

export const variants = tv({
  base: "group focus-ring text-muted hocus:text-foreground relative inline-flex w-fit cursor-pointer items-center whitespace-nowrap disabled:opacity-50",
  variants: {
    theme: {
      primary: "dotted-underline font-link gap-1.5",
      icon: "hocus:bg-rule/40 -m-2 rounded-md p-2",
      compact: "hocus:bg-rule/40 -mx-2 -my-1 gap-1 rounded-md px-2 py-1 font-sans text-xs/normal",
    },
  },
  defaultVariants: {
    theme: "primary",
  },
});

export function Button({ theme, className, ...props }: ButtonProps) {
  return <button type="button" className={variants({ theme, className })} {...props} />;
}
