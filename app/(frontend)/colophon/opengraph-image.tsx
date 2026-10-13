import { site } from "@/config/metadata";
import { createSocialImage } from "@/lib/social-image";
import { singletonSeoIconQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

export const alt = `Colophon ${site.separator} ${site.name}`;
export const contentType = "image/jpeg";

export { socialImageSize as size } from "@/config/social-image";

export default async function Image() {
  const { data: seoIcon } = await sanityFetchCached({
    query: singletonSeoIconQuery,
    params: { type: "colophon" },
    perspective: "published",
  });

  return createSocialImage({ _type: "colophon" }, seoIcon, "toolbox");
}
