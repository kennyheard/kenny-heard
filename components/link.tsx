"use client";

import { IconArrowInbox, IconArrowUpRight } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import NextLink from "next/link";
import { Link as ReactAriaLink, composeRenderProps } from "react-aria-components";
import type { LinkProps as ReactAriaLinkProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

// oxlint-disable-next-line import/no-cycle -- Variants are only invoked at render time, never during module evaluation.
import { variants as buttonVariants } from "@/components/button";
import { Icon } from "@/components/icon";
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
  base: "group focus-ring relative",
  variants: {
    intent: {
      none: "",
      inline: "dotted-underline inline",
      standalone: "dotted-underline inline-flex w-fit items-center",
      block: "flex size-full",
    },
    tone: {
      inherit: "",
      muted: "hocus:text-foreground text-muted",
      subtle: "hocus:text-foreground",
    },
    active: {
      true: "",
    },
  },
  defaultVariants: {
    intent: "inline",
    tone: "inherit",
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
  const { resolvedLink, isExternal, opensNewTab } = linkState;
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

    const { intent, tone } = props;
    return composeRenderProps(className, (composedClassName) =>
      variants({ intent, tone, active: containsActivePath, className: composedClassName }),
    );
  }

  const isStandalone = "intent" in props && props.intent === "standalone";
  const isMuted = "tone" in props && props.tone === "muted";
  const isDownloadLink = resolvedLink?.download === true;
  const isExternalLink = isExternal && !isDownloadLink;

  const glyph = (() => {
    if (!isStandalone) return undefined;
    if (isExternalLink) return IconArrowUpRight;
    if (isDownloadLink) return IconArrowInbox;

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
          {isDefined(glyph) && (
            <Icon
              icon={glyph}
              tone={isMuted ? "inherit" : "muted"}
              className="ml-0.5 inline -translate-y-[calc((1cap-1ex)/2)] align-middle"
            />
          )}
        </>
      ))}
    </ReactAriaLink>
  );
}
