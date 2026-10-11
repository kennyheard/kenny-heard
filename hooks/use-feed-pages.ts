import { useState } from "react";

import { groupByYear } from "@/lib/feed";
import type { FeedEntry } from "@/lib/feed";
import { isDefined } from "@/lib/utils";

/**
 * Pages through the feed's entries, revealing more on request and then the end note once every entry is showing.
 *
 * @param entries - Every entry in the feed, newest first.
 * @param pageSize - Number of entries each request reveals.
 * @param initialCount - Number of entries shown before any request.
 * @param hasEndNote - Whether the feed has a note to reveal at its end.
 * @returns The visible entries grouped by year, the key of the first one just revealed, whether the end note is
 *   showing, whether more can be revealed, and a function that reveals more.
 */
export function useFeedPages(entries: FeedEntry[], pageSize: number, initialCount: number, hasEndNote: boolean) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [revealedIndex, setRevealedIndex] = useState<number>();

  const years = groupByYear(entries.slice(0, visibleCount));
  const revealedKey = isDefined(revealedIndex) ? entries[revealedIndex]?.key : undefined;
  const hasEnded = isDefined(revealedIndex) && revealedIndex >= entries.length;
  const canShowMore = !hasEnded && (visibleCount < entries.length || hasEndNote);

  function showMore() {
    setRevealedIndex(visibleCount);
    setVisibleCount((count) => count + pageSize);
  }

  return { years, revealedKey, hasEnded, canShowMore, showMore };
}
