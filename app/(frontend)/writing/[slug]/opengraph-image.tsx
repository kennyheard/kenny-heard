import { ImageResponse } from "next/og";

import { SocialImage } from "@/components/social-image";
import { site } from "@/config/metadata";
import { socialImageSize } from "@/lib/social-image";
import { articleSeoIconQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

export const alt = site.name;
export const contentType = "image/png";

export { socialImageSize as size } from "@/lib/social-image";
export { generateStaticParams } from "@/app/(frontend)/writing/[slug]/page";

export default async function Image({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const { data: icon } = await sanityFetchCached({
    query: articleSeoIconQuery,
    params: { slug },
    perspective: "published",
  });

  return new ImageResponse(<SocialImage icon={icon} />, socialImageSize);
}
