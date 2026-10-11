import { ImageResponse } from "next/og";

import { SocialImage } from "@/components/social-image";
import { site } from "@/config/metadata";
import { socialImageSize } from "@/lib/social-image";
import { singletonSeoIconQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

export const alt = site.name;
export const contentType = "image/png";

export { socialImageSize as size } from "@/lib/social-image";

export default async function Image() {
  const { data: icon } = await sanityFetchCached({
    query: singletonSeoIconQuery,
    params: { type: "home" },
    perspective: "published",
  });

  return new ImageResponse(<SocialImage icon={icon} />, socialImageSize);
}
