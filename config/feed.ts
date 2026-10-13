import { IconFeather, IconTasks } from "@central-icons-react/round-outlined-radius-2-stroke-1";

import type { CentralIcon } from "@/lib/icons";
import type { SanityArticle } from "@/sanity/schemas/documents/collections/article";
import type { SanityEntry } from "@/sanity/schemas/documents/collections/entry";

/** Number of items on each page of the home page's feed, counting the current work above it on the first. */
export const feedPageSize = 6;

/** Icon a feed item shows when it has none of its own, by the kind of document it comes from. */
export const fallbackFeedIcons: Record<SanityArticle["_type"] | SanityEntry["_type"], CentralIcon> = {
  article: IconFeather,
  entry: IconTasks,
};
