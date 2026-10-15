import { IconArrowInbox, IconArrowUpRight } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import type { SanityLink, SanityLinkState } from "@driftime/sanity-plugin-link/render";

import { resolveLink } from "@/config/links";
import { routes } from "@/config/routes";
import type { SanityRoute } from "@/config/routes";
import { isDefined } from "@/lib/utils";

/** Where a link points: a stored link, a route declared in code, or an address to use as it is. */
export type LinkDestination = SanityLink | SanityRoute | string;

/**
 * Checks whether a destination is a route declared in code rather than a stored link.
 *
 * @param destination - The destination to check.
 * @returns True if the destination is a route.
 */
function isRoute(destination: SanityLink | SanityRoute): destination is SanityRoute {
  return Object.hasOwn(routes, destination._type);
}

/**
 * Sorts a destination into the source the link resolver expects.
 *
 * @param to - Where the link points, or undefined when it leads nowhere.
 * @returns The destination keyed by its kind of source.
 */
function toLinkSource(to: LinkDestination | undefined) {
  if (typeof to === "string") return { href: to };
  if (isDefined(to) && isRoute(to)) return { route: to };

  return { link: to };
}

/**
 * Picks the icon that marks a link as a download or as leading to another site.
 *
 * @param linkState - The resolved link and its navigation state.
 * @returns The icon, or undefined when the link needs none.
 */
function getIcon({ resolvedLink, isExternal }: SanityLinkState) {
  if (resolvedLink?.download === true) return IconArrowInbox;
  if (isExternal) return IconArrowUpRight;

  return undefined;
}

/**
 * Resolves where a link points into what rendering it needs.
 *
 * @param to - Where the link points, or undefined when it leads nowhere.
 * @param pathname - Path of the current page, which marks a link to it as current.
 * @returns The label, the icon, whether it opens a new tab, and the attributes, or undefined when it leads nowhere.
 */
export function resolveLinkAttributes(to: LinkDestination | undefined, pathname?: string) {
  const linkState = resolveLink({ ...toLinkSource(to), pathname });
  const { resolvedLink, opensNewTab } = linkState;
  const href = resolvedLink?.href;
  // Reading this without a pathname throws in development.
  const isActivePath = isDefined(pathname) && linkState.isActivePath;

  return {
    label: resolvedLink?.label,
    icon: getIcon(linkState),
    opensNewTab,
    attributes: isDefined(href)
      ? {
          href,
          target: opensNewTab ? "_blank" : undefined,
          "aria-current": isActivePath ? ("page" as const) : undefined,
        }
      : undefined,
  };
}
