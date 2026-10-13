import { site } from "@/config/metadata";
import { createSocialImage, findFilledIcon } from "@/lib/social-image";
import { articleIconsQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

export const alt = site.name;
export const contentType = "image/jpeg";

export { socialImageSize as size } from "@/config/social-image";
export { generateStaticParams } from "@/app/(frontend)/writing/[slug]/page";

export default async function Image({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const { data } = await sanityFetchCached({
    query: articleIconsQuery,
    params: { slug },
    perspective: "published",
  });

  const { icon, seoIcon } = data ?? {};

  return createSocialImage({ _type: "article", slug }, seoIcon ?? (await findFilledIcon(icon)), "feather");
}
