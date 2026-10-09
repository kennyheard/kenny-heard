import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export type ContainerProps = ComponentProps<"div"> & VariantProps<typeof variants>;

export const variants = tv({
  base: "mx-auto flex w-full max-w-(--breakpoint-container) flex-col gap-y-4",
});

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={variants({ className })} {...props}>
      {children}
    </div>
  );
}
