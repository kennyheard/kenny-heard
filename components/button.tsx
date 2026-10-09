"use client";

import { Button as ReactAriaButton, composeRenderProps } from "react-aria-components";
import type { ButtonProps as ReactAriaButtonProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

// oxlint-disable-next-line import/no-cycle -- Variants are only invoked at render time, never during module evaluation.
import { variants as linkVariants } from "@/components/link";

export type ButtonProps<T extends "button" | "link" = "button"> = T extends "button"
  ? ReactAriaButtonProps & VariantProps<typeof variants> & { as?: "button" }
  : ReactAriaButtonProps & Omit<VariantProps<typeof linkVariants>, "active"> & { as: "link" };

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

export function Button({ className, children, ...props }: ButtonProps<"button" | "link">) {
  function composeVariants() {
    if (props.as === "link") {
      const { intent } = props;
      return composeRenderProps(className, (composedClassName) =>
        linkVariants({ intent, className: composedClassName }),
      );
    }

    const { theme } = props;
    return composeRenderProps(className, (composedClassName) => variants({ theme, className: composedClassName }));
  }

  return (
    <ReactAriaButton className={composeVariants()} {...props}>
      {children}
    </ReactAriaButton>
  );
}
