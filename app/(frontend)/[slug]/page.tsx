import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { PageDocument } from "@/components/documents/page";
import { resolveSanityMetadata } from "@/config/metadata";
import { isDefined } from "@/lib/utils";
import { pageQuery, settingsQuery } from "@/sanity/groq/documents";
import { createStaticParamsQuery } from "@/sanity/groq/routes";
import { getDynamicFetchOptions, sanityFetch, sanityFetchCached } from "@/sanity/lib/live";
import type { CachedDocumentProps } from "@/sanity/lib/live";

type RouteProps = PageProps<"/[slug]">;
type RouteParams = Awaited<RouteProps["params"]>;
type DynamicPageProps = Pick<CachedPageProps, "params">;
type CachedPageProps = CachedDocumentProps & { params: RouteParams };

export const instant = false;

export async function generateMetadata(props: RouteProps): Promise<Metadata> {
  const [params, { perspective }] = await Promise.all([props.params, getDynamicFetchOptions()]);
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetchCached({ query: pageQuery, params, perspective }),
    sanityFetchCached({ query: settingsQuery, perspective }),
  ]);

  return resolveSanityMetadata(page, settings);
}

export async function generateStaticParams() {
  const { data: staticParams } = await sanityFetchCached({
    query: createStaticParamsQuery<RouteParams[]>("page"),
    perspective: "published",
  });

  return isDefined(staticParams) ? staticParams : [{ slug: "__placeholder__" }];
}

export default async function Page(props: RouteProps) {
  const [params, { isEnabled: isDraftMode }] = await Promise.all([props.params, draftMode()]);

  if (isDraftMode) return <DynamicPage params={params} />;

  return <CachedPage params={params} perspective="published" stega={false} isDraftMode={false} />;
}

async function DynamicPage({ params }: DynamicPageProps) {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedPage params={params} perspective={perspective} stega={stega} isDraftMode />;
}

async function CachedPage({ params, perspective, stega, isDraftMode }: CachedPageProps) {
  "use cache";

  const { data: page } = await sanityFetch({ query: pageQuery, params, perspective, stega });

  if (!(isDefined(page?._id) || isDraftMode)) notFound();

  return <PageDocument document={page} />;
}
