import NextLink from "next/link";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { variants as buttonVariants } from "@/components/button";
import { Icon } from "@/components/icon";
import { resolveLinkAttributes } from "@/lib/links";
import type { LinkDestination } from "@/lib/links";
import { isDefined } from "@/lib/utils";
import type { Exclusive } from "@/types";

export type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> &
  Exclusive<VariantProps<typeof variants>, VariantProps<typeof buttonVariants> & { as: "button" }> & {
    to: LinkDestination | undefined;
    pathname?: string;
  };

export const variants = tv({
  base: "group focus-ring relative",
  variants: {
    intent: {
      none: "",
      inline: "dotted-underline inline",
      standalone: "dotted-underline inline",
    },
    tone: {
      inherit: "",
      muted: "hocus:text-foreground text-muted",
      subtle: "hocus:text-foreground",
    },
  },
  defaultVariants: {
    intent: "inline",
    tone: "inherit",
  },
});

export function Link({ to, pathname, as, intent, tone, theme, className, children, ...props }: LinkProps) {
  const { label, icon, opensNewTab, attributes } = resolveLinkAttributes(to, pathname);
  const composedClassName = (as === "button" ? buttonVariants : variants)({ intent, tone, theme, className });

  const content = (
    <>
      {children ?? label}
      {opensNewTab && <span className="sr-only select-none"> (opens in a new tab)</span>}
      {intent === "standalone" && (
        <Icon value={icon} size="0.75em" tone="muted" inline className="group-hocus:text-current ml-0.5" />
      )}
    </>
  );

  if (!isDefined(attributes)) return <span className={composedClassName}>{content}</span>;

  return (
    <NextLink {...attributes} prefetch className={composedClassName} {...props}>
      {content}
    </NextLink>
  );
}
