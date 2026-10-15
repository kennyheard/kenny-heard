"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Requests each responsive width of a Sanity image from the image CDN rather than the Next.js optimiser, keeping the
 * crop, format, and quality already in its URL. When the URL sets both dimensions, the height scales with each width.
 *
 * @param props - The image's URL and the width to request.
 * @returns The URL for that width.
 */
export function loader({ src, width }: ImageLoaderProps) {
  const url = new URL(src);
  const { searchParams } = url;
  const pinnedWidth = Number(searchParams.get("w"));
  const pinnedHeight = Number(searchParams.get("h"));

  searchParams.set("w", String(width));

  if (pinnedWidth > 0 && pinnedHeight > 0) {
    searchParams.set("h", String(Math.round((width * pinnedHeight) / pinnedWidth)));
  } else if (!searchParams.has("fit")) {
    searchParams.set("fit", "max");
  }

  // Commas stay unencoded so the URLs match the ones Sanity's URL builder makes, which caches already hold.
  const search = url.search.replaceAll("%2C", ",");

  return `${url.origin}${url.pathname}${search}`;
}
