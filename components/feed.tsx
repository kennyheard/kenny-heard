"use client";

import { IconArrowDown, IconFeather } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import type { ReactNode } from "react";

import { Button } from "@/components/button";
import { Entry } from "@/components/entry";
import { EntryList } from "@/components/entry-list";
import { Icon } from "@/components/icon";
import { Row } from "@/components/row";
import { useFeedPages } from "@/hooks/use-feed-pages";
import { focusRevealed } from "@/lib/feed";
import type { FeedEntry } from "@/lib/feed";
import { isDefined } from "@/lib/utils";

export interface FeedProps {
  entries: FeedEntry[];
  pageSize: number;
  initialCount: number;
  children?: ReactNode;
}

export function Feed({ entries, pageSize, initialCount, children }: FeedProps) {
  const { years, revealedKey, hasEnded, canShowMore, showMore } = useFeedPages(
    entries,
    pageSize,
    initialCount,
    isDefined(children),
  );

  const showMoreButton = canShowMore && (
    <Button onPress={showMore}>
      <Icon icon={IconArrowDown} />
      Show a few more
    </Button>
  );

  return (
    <>
      {years.map(({ year, entries: yearEntries }, index) => (
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
            {index === years.length - 1 && showMoreButton}
          </EntryList>
        </Row>
      ))}
      {hasEnded && (
        <div ref={focusRevealed} tabIndex={-1} className="focus:outline-none">
          {children}
        </div>
      )}
      {!isDefined(years) && canShowMore && <Row>{showMoreButton}</Row>}
    </>
  );
}
