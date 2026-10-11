"use client";

import { IconArrowDown, IconFeather } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/button";
import { Entry } from "@/components/entry";
import { EntryList } from "@/components/entry-list";
import { Icon } from "@/components/icon";
import { Row } from "@/components/row";
import { groupByYear } from "@/lib/feed";
import type { FeedEntry } from "@/lib/feed";
import { isDefined } from "@/lib/utils";

export interface FeedProps {
  entries: FeedEntry[];
  pageSize: number;
  initialCount: number;
  children?: ReactNode;
}

/**
 * Moves focus to whatever the feed has just revealed, so keyboard and screen reader users carry on from it.
 *
 * @param node - The revealed element, or null when it unmounts.
 */
function focusRevealed(node: HTMLDivElement | null) {
  node?.focus();
}

export function Feed({ entries, pageSize, initialCount, children }: FeedProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [revealedIndex, setRevealedIndex] = useState<number>();

  const visibleEntries = entries.slice(0, visibleCount);
  const revealedKey = isDefined(revealedIndex) ? entries[revealedIndex]?.key : undefined;
  const hasEnded = isDefined(revealedIndex) && revealedIndex >= entries.length;
  const canShowMore = !hasEnded && (visibleCount < entries.length || isDefined(children));

  function handleShowMore() {
    setRevealedIndex(visibleCount);
    setVisibleCount((count) => count + pageSize);
  }

  return (
    <>
      {groupByYear(visibleEntries).map(({ year, entries: yearEntries }) => (
        <Row key={year} label={year}>
          <EntryList>
            {yearEntries.map(({ key, type, icon, title, description, link, href, readingTime, isComingSoon }) => {
              const isFirstRevealed = key === revealedKey;

              return (
                <Entry
                  key={key}
                  ref={isFirstRevealed ? focusRevealed : undefined}
                  tabIndex={isFirstRevealed ? -1 : undefined}
                  icon={type === "article" ? IconFeather : icon}
                  title={title}
                  description={description}
                  link={link}
                  href={href}
                  readingTime={readingTime}
                  isComingSoon={isComingSoon}
                  className="focus:outline-none"
                />
              );
            })}
          </EntryList>
        </Row>
      ))}
      {hasEnded && (
        <div ref={focusRevealed} tabIndex={-1} className="focus:outline-none">
          {children}
        </div>
      )}
      {canShowMore && (
        <Row>
          <Button onPress={handleShowMore}>
            <Icon icon={IconArrowDown} />
            Show a few more
          </Button>
        </Row>
      )}
    </>
  );
}
