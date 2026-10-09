import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { ArticleDocument } from "@/components/documents/article";
import { resolveSanityMetadata } from "@/config/metadata";
import { isDefined } from "@/lib/utils";
import { articleQuery, settingsQuery } from "@/sanity/groq/documents";
import { createStaticParamsQuery } from "@/sanity/groq/routes";
import { getDynamicFetchOptions, sanityFetch, sanityFetchCached } from "@/sanity/lib/live";
import type { CachedDocumentProps } from "@/sanity/lib/live";

type RouteProps = PageProps<"/writing/[slug]">;
type RouteParams = Awaited<RouteProps["params"]>;
type DynamicArticleProps = Pick<CachedArticleProps, "params">;
type CachedArticleProps = CachedDocumentProps & { params: RouteParams };

export const instant = false;

export async function generateMetadata(props: RouteProps): Promise<Metadata> {
  const [params, { perspective }] = await Promise.all([props.params, getDynamicFetchOptions()]);
  const [{ data: article }, { data: settings }] = await Promise.all([
    sanityFetchCached({ query: articleQuery, params, perspective }),
    sanityFetchCached({ query: settingsQuery, perspective }),
  ]);

  return resolveSanityMetadata(article, settings);
}

export async function generateStaticParams() {
  const { data: staticParams } = await sanityFetchCached({
    query: createStaticParamsQuery<RouteParams[]>("article"),
    perspective: "published",
  });

  return isDefined(staticParams) ? staticParams : [{ slug: "__placeholder__" }];
}

export default async function Article(props: RouteProps) {
  const [params, { isEnabled: isDraftMode }] = await Promise.all([props.params, draftMode()]);

  if (isDraftMode) return <DynamicArticle params={params} />;

  return <CachedArticle perspective="published" stega={false} isDraftMode={false} params={params} />;
}

async function DynamicArticle({ params }: DynamicArticleProps) {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedArticle perspective={perspective} stega={stega} isDraftMode params={params} />;
}

async function CachedArticle({ perspective, stega, isDraftMode, params }: CachedArticleProps) {
  "use cache";

  const { data: article } = await sanityFetch({ query: articleQuery, params, perspective, stega });

  if (!(isDefined(article?._id) || isDraftMode)) notFound();

  return <ArticleDocument document={article} />;
}
