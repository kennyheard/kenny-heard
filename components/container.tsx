import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export type ContainerProps = ComponentProps<"div"> & VariantProps<typeof variants>;

export const variants = tv({
  base: "max-w-content mx-auto flex flex-col",
});

export function Container({ className, ...props }: ContainerProps) {
  return <div className={variants({ className })} {...props} />;
}
