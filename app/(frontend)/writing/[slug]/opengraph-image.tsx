import { stegaClean } from "next-sanity";
import { ImageResponse } from "next/og";

import { ArticleSocialImage } from "@/components/social-images/article";
import { getDatestamp } from "@/config/dates";
import { site } from "@/config/metadata";
import { getReadingMinutes } from "@/lib/portable-text";
import { getSocialIdentity, socialImageFonts, socialImageSize } from "@/lib/social-image";
import { isDefined } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import { articleQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

export const alt = site.name;
export const contentType = "image/png";

export { socialImageSize as size } from "@/lib/social-image";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const [identity, { data: article }] = await Promise.all([
    getSocialIdentity(),
    sanityFetchCached({ query: articleQuery, params: await params, perspective: "published" }),
  ]);
  const { title, date, body } = article ?? {};
  const minutes = isDefined(body) ? getReadingMinutes(body) : undefined;

  return new ImageResponse(
    <ArticleSocialImage
      {...identity}
      title={title ?? defaultDocumentTitle}
      date={getDatestamp(stegaClean(date))}
      minutes={minutes}
    />,
    {
      ...socialImageSize,
      fonts: socialImageFonts,
    },
  );
}
