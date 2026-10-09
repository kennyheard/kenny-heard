import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { HomeDocument } from "@/components/documents/home";
import { resolveSanityMetadata } from "@/config/metadata";
import { isDefined } from "@/lib/utils";
import { homeQuery, settingsQuery } from "@/sanity/groq/documents";
import { getDynamicFetchOptions, sanityFetch, sanityFetchCached } from "@/sanity/lib/live";
import type { CachedDocumentProps } from "@/sanity/lib/live";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const [{ data: home }, { data: settings }] = await Promise.all([
    sanityFetchCached({ query: homeQuery, perspective }),
    sanityFetchCached({ query: settingsQuery, perspective }),
  ]);

  return resolveSanityMetadata(home, settings);
}

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) return <DynamicHome />;

  return <CachedHome perspective="published" stega={false} isDraftMode={false} />;
}

async function DynamicHome() {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedHome perspective={perspective} stega={stega} isDraftMode />;
}

async function CachedHome({ perspective, stega, isDraftMode }: CachedDocumentProps) {
  "use cache";

  const { data: home } = await sanityFetch({ query: homeQuery, perspective, stega });

  if (!(isDefined(home?._id) || isDraftMode)) notFound();

  return <HomeDocument document={home} />;
}
