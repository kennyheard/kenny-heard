import type { MetadataRoute } from "next";

import { site } from "@/config/metadata";
import { themeColors } from "@/config/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: themeColors.light.background,
    theme_color: themeColors.light.background,
    icons: [
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { src: "/icon-mask.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
