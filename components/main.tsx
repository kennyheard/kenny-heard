import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export type MainProps = ComponentProps<"main"> & VariantProps<typeof variants>;

export const variants = tv({});

export function Main({ className, children, ...props }: MainProps) {
  return (
    <main id="main" className={variants({ className })} {...props}>
      {children}
    </main>
  );
}
