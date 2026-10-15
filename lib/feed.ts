import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { stegaClean } from "next-sanity";

import { fallbackFeedIcons, feedPageSize } from "@/config/feed";
import type { CentralIcon } from "@/lib/icons";
import type { SanityReadingTime } from "@/sanity/groq/fragments";
import type { SanityArticle } from "@/sanity/schemas/documents/collections/article";
import type { SanityEntry } from "@/sanity/schemas/documents/collections/entry";

/** Article or entry as the home page's feed fetches it, shaped as the entry it shows. */
export type SanityFeedItem = (SanityArticle | SanityEntry) &
  SanityReadingTime & {
    /** Where the title links to: an article's own page, or an entry's link once it has launched. */
    link?: SanityLink;
    /** Whether the item hasn't launched yet. */
    isComingSoon: boolean;
  };

/** Feed item as the feed shows it, with an icon for certain and its place in the whole feed. */
export type FeedItem = Omit<SanityFeedItem, "icon"> & { icon: CentralIcon | SanityIcon; index: number };

/**
 * Groups feed items into runs from the same year, numbering each by its place in the whole feed and giving any item
 * without an icon the one for its kind.
 *
 * @param items - The items, newest first.
 * @returns The runs, newest first, each with the places of its first and last item.
 */
export function groupFeedByYear(items: SanityFeedItem[]) {
  const years: { year: string; start: number; end: number; items: FeedItem[] }[] = [];

  for (const [index, item] of items.entries()) {
    const year = stegaClean(item.date)?.slice(0, 4) ?? "";
    const feedItem = { ...item, icon: item.icon ?? fallbackFeedIcons[item._type], index };
    const lastYear = years.at(-1);

    if (lastYear?.year === year) {
      lastYear.items.push(feedItem);
      lastYear.end = index;
    } else {
      years.push({ year, start: index, end: index, items: [feedItem] });
    }
  }

  return years;
}

/**
 * Works out how many entries the feed's first page shows, once the items above it have taken their share, and never
 * fewer than one.
 *
 * @param itemsAbove - Number of items shown above the feed on its first page.
 * @returns The number of entries.
 */
export function getFirstPageCount(itemsAbove: number) {
  return Math.max(feedPageSize - itemsAbove, 1);
}
