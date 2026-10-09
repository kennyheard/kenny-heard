import { defineMetadataConfig } from "@/lib/metadata";
import defaultSeoImage from "@/public/default-seo-image.png";

/** Favicons for every page, including the Studio's. */
export const icons = {
  icon: [{ url: "/favicon.ico", sizes: "32x32" }],
  apple: [{ url: "/apple-touch-icon.png" }],
};

/** Site values and metadata shared by every page. */
const config = defineMetadataConfig({
  site: {
    name: "Kenny Heard",
    suffix: "Kenny Heard",
    separator: "|",
    description: "A growing collection of the things I make and write, gathered in one place as they happen.",
    image: defaultSeoImage.src,
  },
  metadata: {
    icons,
    manifest: "/manifest.webmanifest",
  },
});

export const { site, resolveMetadata, resolveSanityMetadata } = config;
