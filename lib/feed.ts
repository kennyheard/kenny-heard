import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import type { SanityLink, SanityLinkRouteParams } from "@driftime/sanity-plugin-link/render";
import { stegaClean } from "next-sanity";

import { resolveRoute } from "@/config/links";
import { formatReadingTime, getReadingMinutes } from "@/lib/portable-text";
import { isDefined } from "@/lib/utils";
import type { SanityArticle } from "@/sanity/schemas/documents/collections/article";
import type { SanityEntry } from "@/sanity/schemas/documents/collections/entry";

/** Article or entry as the home page's feed fetches it, with only the fields it shows and an article's text for its reading time. */
export type SanityFeedItem = Pick<SanityArticle | SanityEntry, "_id" | "_type" | "title" | "description" | "date"> &
  Pick<SanityEntry, "icon" | "link" | "comingSoon"> &
  Pick<SanityArticle, "body"> & {
    /** Route parameter values, present on articles. */
    _routeParams?: SanityLinkRouteParams;
  };

/** Item in the home page's feed, as the plain values it shows. */
export interface FeedEntry {
  /** Unique key for the item. */
  key: string;
  /** Kind of document the item comes from. */
  type: SanityFeedItem["_type"];
  /** Icon chosen for an entry, or undefined for an article. */
  icon?: SanityIcon;
  /** Title shown in the feed. */
  title?: string;
  /** One-line summary shown under the title. */
  description?: string;
  /** Year the item is dated. */
  year: string;
  /** Link an entry's title goes to, or undefined for an article or an item that doesn't link. */
  link?: SanityLink;
  /** Address an article's title links to, or undefined for an entry. */
  href?: string;
  /** How long an article takes to read, such as "12 minutes", or undefined for an entry. */
  readingTime?: string;
  /** Whether the item hasn't launched yet. */
  isComingSoon: boolean;
}

/** Run of consecutive feed items from the same year. */
export interface FeedYear {
  /** Year the items are dated. */
  year: string;
  /** Items from that year, in feed order. */
  entries: FeedEntry[];
}

/**
 * Maps a fetched article or entry to the plain values the feed shows.
 *
 * @param item - The article or entry.
 * @returns The feed item.
 */
export function toFeedEntry(item: SanityFeedItem): FeedEntry {
  const { _id, _type, icon, title, description, date, link, comingSoon, body } = item;
  const isComingSoon = comingSoon === true;

  return {
    key: _id,
    type: _type,
    icon,
    title,
    description,
    year: stegaClean(date)?.slice(0, 4) ?? "",
    link: _type === "entry" && !isComingSoon ? link : undefined,
    href: _type === "article" ? resolveRoute(item) : undefined,
    readingTime: isDefined(body) ? formatReadingTime(getReadingMinutes(body)) : undefined,
    isComingSoon,
  };
}

/**
 * Groups feed items into runs from the same year, keeping their order.
 *
 * @param entries - The feed items, newest first.
 * @returns The runs, newest first.
 */
export function groupByYear(entries: FeedEntry[]) {
  const groups: FeedYear[] = [];

  for (const entry of entries) {
    const lastGroup = groups.at(-1);

    if (lastGroup?.year === entry.year) lastGroup.entries.push(entry);
    else groups.push({ year: entry.year, entries: [entry] });
  }

  return groups;
}
