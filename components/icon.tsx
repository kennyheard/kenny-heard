import type { CentralIconBaseProps } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { Icon as SanityPluginIcon } from "@driftime/sanity-plugin-icon/render";
import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { defaultIconProps } from "@/config/icons";
import { isSanityIcon } from "@/lib/icons";
import type { CentralIcon } from "@/lib/icons";
import { isDefined } from "@/lib/utils";

export type IconProps = Omit<CentralIconBaseProps, "size" | "strokeWidth"> &
  VariantProps<typeof variants> & {
    icon: CentralIcon | SanityIcon | undefined;
    size?: `${number}em` | `${number}rem`;
  };

export const variants = tv({
  base: "shrink-0 **:[vector-effect:non-scaling-stroke]",
  variants: {
    tone: {
      muted: "text-muted",
      faint: "text-faint",
      inherit: "",
    },
    inline: {
      true: "inline -translate-y-[calc((1cap-1ex)/2)] align-middle",
    },
  },
  defaultVariants: {
    tone: "inherit",
  },
});

export function Icon({ icon, size, tone, inline, className, ...props }: IconProps) {
  const resolvedSize = size ?? defaultIconProps.size;

  if (isSanityIcon(icon)) {
    return (
      <SanityPluginIcon
        value={icon}
        width={resolvedSize}
        height={resolvedSize}
        strokeWidth={defaultIconProps.strokeWidth}
        aria-hidden
        className={variants({ tone, inline, className })}
        {...props}
      />
    );
  }

  if (!isDefined(icon)) return null;

  const Glyph = icon;

  return (
    <Glyph
      size={resolvedSize}
      strokeWidth={defaultIconProps.strokeWidth}
      aria-hidden
      className={variants({ tone, inline, className })}
      {...props}
    />
  );
}
