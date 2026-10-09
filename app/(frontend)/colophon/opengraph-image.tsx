import { ImageResponse } from "next/og";

import { ColophonSocialImage } from "@/components/social-images/colophon";
import { site } from "@/config/metadata";
import { getSocialIdentity, socialImageFonts, socialImageSize } from "@/lib/social-image";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import { colophonQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

export const alt = `Colophon ${site.separator} ${site.name}`;
export const contentType = "image/png";

export { socialImageSize as size } from "@/lib/social-image";

export default async function Image() {
  const [identity, { data: colophon }] = await Promise.all([
    getSocialIdentity(),
    sanityFetchCached({ query: colophonQuery, perspective: "published" }),
  ]);
  const { title, introduction } = colophon ?? {};

  return new ImageResponse(
    <ColophonSocialImage {...identity} title={title ?? defaultDocumentTitle} introduction={introduction} />,
    { ...socialImageSize, fonts: socialImageFonts },
  );
}
