import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { resolveSanityMetadata } from "@/config/metadata";
import { settingsQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

export async function generateMetadata(): Promise<Metadata> {
  // Published only: reading draft mode here would make this otherwise static route dynamic.
  const { data: settings } = await sanityFetchCached({ query: settingsQuery, perspective: "published" });

  return resolveSanityMetadata(undefined, settings);
}

export default function CatchAllNotFound() {
  return notFound();
}
