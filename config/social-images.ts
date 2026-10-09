import type { CSSProperties } from "react";

import { themeColors } from "@/config/theme";

/** Text styles at 1.5 times the site's, shared by every social image. */
export const socialImageText: Record<"identity" | "title" | "details" | "introduction", CSSProperties> = {
  identity: { fontFamily: "Timeless Serif", fontSize: 24, lineHeight: 1.375 },
  title: { fontFamily: "Timeless Serif", fontSize: 54, fontStyle: "italic", lineHeight: 1.25, textWrap: "balance" },
  details: { color: themeColors.light.muted, fontFamily: "Geist Mono", fontSize: 18, lineHeight: 1.5 },
  introduction: {
    color: themeColors.light.muted,
    fontFamily: "Timeless Sans",
    fontSize: 21,
    lineHeight: 1.5,
    textWrap: "pretty",
  },
};

/** Font files for drawing social images, as TTFs because the renderer can't read WOFF2. */
export const socialImageFontFiles: { name: string; file: string; style: "normal" | "italic"; weight: 400 }[] = [
  { name: "Timeless Serif", file: "TimelessSerif-TextRegular.ttf", style: "normal", weight: 400 },
  { name: "Timeless Serif", file: "TimelessSerif-RegularItalic.ttf", style: "italic", weight: 400 },
  { name: "Timeless Sans", file: "TimelessSans-GroteskRegular.ttf", style: "normal", weight: 400 },
  { name: "Geist Mono", file: "GeistMono-Regular.ttf", style: "normal", weight: 400 },
];
