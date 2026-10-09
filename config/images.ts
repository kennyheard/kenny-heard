import { defineImageConfig } from "@/lib/images";

export type ImageProfile = keyof typeof config.imageProfiles;

/** Maximum content width in pixels, which must match `--breakpoint-container` in `app/styles/globals.css`. */
export const containerMaxWidth = 640;

/** Image profiles for each context an image appears in. */
const config = defineImageConfig({
  content: {
    options: { format: "webp", quality: 75 },
    sizes: `(max-width: ${containerMaxWidth}px) 100vw, ${containerMaxWidth}px`,
  },
});

export const { imageProfiles, resolveImage } = config;
