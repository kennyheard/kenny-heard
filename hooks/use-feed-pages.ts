import { useState } from "react";

/**
 * Pages through the feed, revealing more entries on request and then the end note, which counts as one more item after
 * the entries and is revealed by a request of its own.
 *
 * @param count - Number of entries in the feed.
 * @param pageSize - Number of entries each request reveals.
 * @param initialCount - Number of entries shown before any request.
 * @param hasEndNote - Whether the feed has a note to reveal at its end.
 * @returns How many items are showing, the place of the last entry showing and of the first item just revealed,
 *   whether more can be revealed, and a function that reveals more.
 */
export function useFeedPages(count: number, pageSize: number, initialCount: number, hasEndNote: boolean) {
  const [visibleCount, setVisibleCount] = useState(Math.min(initialCount, count));
  const [revealedIndex, setRevealedIndex] = useState<number>();

  const total = hasEndNote ? count + 1 : count;
  const lastVisibleIndex = Math.min(visibleCount, count) - 1;
  const canShowMore = visibleCount < total;

  function showMore() {
    setRevealedIndex(visibleCount);
    setVisibleCount(visibleCount < count ? Math.min(visibleCount + pageSize, count) : total);
  }

  return { visibleCount, lastVisibleIndex, revealedIndex, canShowMore, showMore };
}
