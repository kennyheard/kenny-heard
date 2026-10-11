import { Icon } from "@driftime/sanity-plugin-icon/render";
import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";

import { themeColors } from "@/config/theme";
import type { Nullable } from "@/types";

export interface SocialImageProps {
  icon: Nullable<SanityIcon>;
}

/** Line width, in the icon's 24-unit grid, that keeps the site's 1px line at 16px in proportion at any size. */
const iconLineWidth = 24 / 16;

export function SocialImage({ icon }: SocialImageProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: themeColors.light.background,
        color: themeColors.light.muted,
      }}
    >
      <Icon value={icon ?? undefined} width={160} height={160} strokeWidth={iconLineWidth} />
    </div>
  );
}
