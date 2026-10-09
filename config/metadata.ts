import { defineMetadataConfig } from "@/lib/metadata";
import defaultSeoImage from "@/public/default-seo-image.png";

/** Favicons for every page, including the Studio's. */
export const icons = {
  icon: [
    { url: "/favicon.ico", sizes: "32x32" },
    { url: "/icon.svg", type: "image/svg+xml" },
  ],
  apple: [{ url: "/apple-touch-icon.png" }],
};

/** Site values and metadata shared by every page. */
const config = defineMetadataConfig({
  site: {
    name: "Cairn",
    suffix: "Made by Driftime®",
    separator: "|",
    description: "An intentional step towards a more responsible web.",
    image: defaultSeoImage.src,
  },
  metadata: {
    icons,
    manifest: "/manifest.webmanifest",
  },
});

export const { site, resolveMetadata, resolveSanityMetadata } = config;
