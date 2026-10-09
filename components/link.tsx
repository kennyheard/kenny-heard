"use client";

import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { ArrowDownIcon, ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import NextLink from "next/link";
import { Link as ReactAriaLink, composeRenderProps } from "react-aria-components";
import type { LinkProps as ReactAriaLinkProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

// oxlint-disable-next-line import/no-cycle -- Variants are only invoked at render time, never during module evaluation.
import { variants as buttonVariants } from "@/components/button";
import { defaultIconProps } from "@/config/icons";
import { resolveLink } from "@/config/links";
import type { SanityRoute } from "@/config/routes";
import { isDefined } from "@/lib/utils";

interface LinkWithSanityLinkProps {
  link: SanityLink | undefined;
  route?: never;
  href?: never;
}

interface LinkWithSanityRouteProps {
  link?: never;
  route: SanityRoute | undefined;
  href?: never;
}

interface LinkWithHrefProps {
  link?: never;
  route?: never;
  href: string | undefined;
}

interface LinkPathnameProps {
  /** Path of the current page, which enables the active state. */
  pathname?: string;
}

type LinkCommonProps = ReactAriaLinkProps &
  (LinkWithSanityLinkProps | LinkWithSanityRouteProps | LinkWithHrefProps) &
  LinkPathnameProps;

export type LinkProps<T extends "link" | "button" = "link"> = T extends "link"
  ? LinkCommonProps & Omit<VariantProps<typeof variants>, "active"> & { as?: "link" }
  : LinkCommonProps & VariantProps<typeof buttonVariants> & { as: "button" };

export const variants = tv({
  base: "group focus-ring relative inline-flex w-fit transition-colors",
  variants: {
    intent: {
      none: "",
      inline: "hocus:underline inline",
      block: "flex size-full",
    },
    active: {
      true: "",
    },
  },
  defaultVariants: {
    intent: "inline",
  },
});

export function Link({
  link,
  route,
  href,
  pathname,
  target,
  className,
  children,
  ...props
}: LinkProps<"link" | "button">) {
  const linkState = resolveLink({ link, route, href, pathname });
  const { resolvedLink, isExternal, opensNewTab, hasAnchor } = linkState;
  // These getters throw in development without a pathname, so only read them when one is given.
  const containsActivePath = isDefined(pathname) && linkState.containsActivePath;
  const isActivePath = isDefined(pathname) && linkState.isActivePath;

  function composeVariants() {
    if (props.as === "button") {
      const { theme } = props;
      return composeRenderProps(className, (composedClassName) =>
        buttonVariants({ theme, className: composedClassName }),
      );
    }

    const { intent } = props;
    return composeRenderProps(className, (composedClassName) =>
      variants({ intent, active: containsActivePath, className: composedClassName }),
    );
  }

  const isButton = props.as === "button";
  const isLinkBlock = "intent" in props && props.intent === "block";
  const isDownloadLink = resolvedLink?.download === true;
  const isExternalLink = isExternal && !isDownloadLink;

  const Icon = (() => {
    if (isButton || isLinkBlock) return undefined;
    if (isExternalLink) return ArrowUpRightIcon;
    if (isDownloadLink) return DownloadIcon;
    if (hasAnchor) return ArrowDownIcon;

    return undefined;
  })();

  return (
    <ReactAriaLink
      href={resolvedLink?.href}
      target={target ?? (opensNewTab ? "_blank" : undefined)}
      className={composeVariants()}
      aria-current={isActivePath ? "page" : undefined}
      render={(renderProps) =>
        "href" in renderProps ? <NextLink {...renderProps} prefetch /> : <span {...renderProps} />
      }
      {...props}
    >
      {composeRenderProps(children, (composedChildren) => (
        <>
          {composedChildren ?? resolvedLink?.label}
          {opensNewTab && <span className="sr-only"> (opens in a new tab)</span>}
          {isDefined(Icon) && <Icon {...defaultIconProps} className="ml-0.5 inline align-baseline" />}
        </>
      ))}
    </ReactAriaLink>
  );
}
