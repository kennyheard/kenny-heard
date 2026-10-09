import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { ColophonDocument } from "@/components/documents/colophon";
import { resolveSanityMetadata } from "@/config/metadata";
import { isDefined } from "@/lib/utils";
import { colophonQuery, settingsQuery } from "@/sanity/groq/documents";
import { getDynamicFetchOptions, sanityFetch, sanityFetchCached } from "@/sanity/lib/live";
import type { CachedDocumentProps } from "@/sanity/lib/live";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const [{ data: colophon }, { data: settings }] = await Promise.all([
    sanityFetchCached({ query: colophonQuery, perspective }),
    sanityFetchCached({ query: settingsQuery, perspective }),
  ]);

  return resolveSanityMetadata(colophon, settings);
}

export default async function Colophon() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) return <DynamicColophon />;

  return <CachedColophon perspective="published" stega={false} isDraftMode={false} />;
}

async function DynamicColophon() {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedColophon perspective={perspective} stega={stega} isDraftMode />;
}

async function CachedColophon({ perspective, stega, isDraftMode }: CachedDocumentProps) {
  "use cache";

  const { data: colophon } = await sanityFetch({ query: colophonQuery, perspective, stega });

  if (!(isDefined(colophon?._id) || isDraftMode)) notFound();

  return <ColophonDocument document={colophon} />;
}
