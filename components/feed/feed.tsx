import type { ReactNode } from "react";

import { Entry } from "@/components/entry";
import { FeedItem } from "@/components/feed/feed-item";
import { FeedMoreButton } from "@/components/feed/feed-more-button";
import { FeedPages } from "@/components/feed/feed-pages";
import { FeedYear } from "@/components/feed/feed-year";
import { Row } from "@/components/row";
import { feedPageSize } from "@/config/feed";
import { groupFeedByYear } from "@/lib/feed";
import type { SanityFeedItem } from "@/lib/feed";
import { isDefined } from "@/lib/utils";

export interface FeedProps {
  items: SanityFeedItem[];
  initialCount: number;
  endNote?: ReactNode;
}

export function Feed({ items, initialCount, endNote }: FeedProps) {
  if (!isDefined(items)) return <>{endNote}</>;

  return (
    <FeedPages count={items.length} pageSize={feedPageSize} initialCount={initialCount} hasEndNote={isDefined(endNote)}>
      {groupFeedByYear(items).map(({ year, start, end, items: yearItems }) => (
        <FeedYear key={year} start={start}>
          <Row label={year}>
            {yearItems.map((item) => (
              <FeedItem key={item._id} index={item.index}>
                <Entry entry={item} />
              </FeedItem>
            ))}
            <FeedMoreButton lastIndex={end} />
          </Row>
        </FeedYear>
      ))}
      <FeedItem index={items.length}>{endNote}</FeedItem>
    </FeedPages>
  );
}
