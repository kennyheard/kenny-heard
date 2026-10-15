import { createContext } from "react";

import type { useFeedPages } from "@/hooks/use-feed-pages";

/** How far the home page's feed has been revealed, and a way to reveal more. */
export type FeedPagesContextValue = ReturnType<typeof useFeedPages>;

/** The feed's paging, shared with the parts that appear as it grows. Outside a feed, nothing is revealed. */
export const FeedPagesContext = createContext<FeedPagesContextValue>({
  visibleCount: 0,
  lastVisibleIndex: -1,
  revealedIndex: undefined,
  canShowMore: false,
  showMore: () => undefined,
});
