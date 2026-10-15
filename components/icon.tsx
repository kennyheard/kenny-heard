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
    value: CentralIcon | SanityIcon | undefined;
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
      true: "pe-(--icon-size)",
    },
  },
  defaultVariants: {
    tone: "inherit",
  },
});

export function Icon({ value, size, tone, inline = false, className, ...props }: IconProps) {
  const resolvedSize = size ?? defaultIconProps.size;
  const composedClassName = variants({ tone, inline, className });

  if (!isDefined(value)) return null;

  // Keeps the icon on the same line as the word before it.
  if (inline) {
    return (
      <span className={composedClassName} style={{ "--icon-size": resolvedSize }}>
        <span className="absolute">
          <Icon
            value={value}
            size={size}
            className="inline -translate-y-[calc((1cap-1ex)/2)] align-middle"
            {...props}
          />
        </span>
      </span>
    );
  }

  if (isSanityIcon(value)) {
    return (
      <SanityPluginIcon
        value={value}
        width={resolvedSize}
        height={resolvedSize}
        strokeWidth={defaultIconProps.strokeWidth}
        aria-hidden
        className={composedClassName}
        {...props}
      />
    );
  }

  const Component = value;
  return (
    <Component
      size={resolvedSize}
      strokeWidth={defaultIconProps.strokeWidth}
      aria-hidden
      className={composedClassName}
      {...props}
    />
  );
}
