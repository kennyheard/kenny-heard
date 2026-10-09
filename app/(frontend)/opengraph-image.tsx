import { ImageResponse } from "next/og";

import { HomeSocialImage } from "@/components/social-images/home";
import { site } from "@/config/metadata";
import { getSocialIdentity, socialImageFonts, socialImageSize } from "@/lib/social-image";
import { homeQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

export const alt = site.name;
export const contentType = "image/png";

export { socialImageSize as size } from "@/lib/social-image";

export default async function Image() {
  const [identity, { data: home }] = await Promise.all([
    getSocialIdentity(),
    sanityFetchCached({ query: homeQuery, perspective: "published" }),
  ]);

  return new ImageResponse(<HomeSocialImage {...identity} introduction={home?.introduction ?? site.description} />, {
    ...socialImageSize,
    fonts: socialImageFonts,
  });
}
