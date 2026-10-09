import type { CentralIconBaseProps } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import { createElement } from "react";
import type { ComponentType } from "react";

import { defaultSanityIconProps } from "@/config/icons";
import { isDefined } from "@/lib/utils";

/** Icon component from Central Icon System. */
export type CentralIcon = ComponentType<CentralIconBaseProps>;

/**
 * Checks whether an icon was chosen in Sanity rather than imported from Central Icon System.
 *
 * @param icon - The icon to check.
 * @returns True if the icon is a stored Sanity icon.
 */
export function isSanityIcon(icon: CentralIcon | SanityIcon | undefined): icon is SanityIcon {
  return typeof icon === "object" && "_type" in icon;
}

/**
 * Wraps an icon for use in the Studio.
 *
 * @param icon - The icon to wrap.
 * @param props - Props that override the Studio icon defaults.
 * @returns An icon component, or undefined when no icon is given.
 */
export function createSanityIcon(icon: CentralIcon | undefined, props?: CentralIconBaseProps) {
  if (!isDefined(icon)) return undefined;

  const Icon = icon;

  function SanityIcon() {
    return createElement(Icon, { ...defaultSanityIconProps, ...props });
  }

  return SanityIcon;
}
