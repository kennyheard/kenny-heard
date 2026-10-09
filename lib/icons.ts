import type { CentralIconBaseProps } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { createElement } from "react";
import type { ComponentType } from "react";

import { defaultSanityIconProps } from "@/config/icons";
import { isDefined } from "@/lib/utils";

/** Icon component from Central Icon System. */
export type CentralIcon = ComponentType<CentralIconBaseProps>;

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
