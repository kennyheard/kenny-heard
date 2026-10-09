import type { LucideIcon, LucideProps } from "lucide-react";
import { createElement } from "react";

import { defaultSanityIconProps } from "@/config/icons";
import { isDefined } from "@/lib/utils";

/**
 * Wraps a Lucide icon for use in the Studio.
 *
 * @param icon - The icon to wrap.
 * @param props - Props that override the Studio icon defaults.
 * @returns An icon component, or undefined when no icon is given.
 */
export function createSanityIcon(icon: LucideIcon | undefined, props?: LucideProps) {
  if (!isDefined(icon)) return undefined;

  const Icon = icon;

  function SanityIcon() {
    return createElement(Icon, { ...defaultSanityIconProps, ...props });
  }

  return SanityIcon;
}
