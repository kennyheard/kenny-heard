import type { ReactNode } from "react";

import { socialImageText } from "@/config/social-images";
import { themeColors } from "@/config/theme";
import { isDefined } from "@/lib/utils";

export interface SocialImageFrameProps {
  name: string;
  role?: string;
  children: ReactNode;
}

export function SocialImageFrame({ name, role, children }: SocialImageFrameProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 80,
        backgroundColor: themeColors.light.background,
        color: themeColors.light.foreground,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6, ...socialImageText.identity }}>
        <div>{name}</div>
        {isDefined(role) && <div style={{ color: themeColors.light.muted, fontStyle: "italic" }}>{role}</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
    </div>
  );
}
