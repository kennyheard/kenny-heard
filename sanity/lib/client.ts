import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

/** Sanity client for published content, served through the CDN. */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: true,
  stega: { studioUrl },
});
