"use client";

import { IconArrowDown } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { use } from "react";

import { Button } from "@/components/button";
import type { ButtonProps } from "@/components/button";
import { Icon } from "@/components/icon";
import { FeedPagesContext } from "@/contexts/feed-pages";

export type FeedMoreButtonProps = Omit<ButtonProps, "children" | "onClick"> & {
  lastIndex: number;
};

export function FeedMoreButton({ lastIndex, ...props }: FeedMoreButtonProps) {
  const { lastVisibleIndex, canShowMore, showMore } = use(FeedPagesContext);

  if (!canShowMore || lastIndex < lastVisibleIndex) return null;

  return (
    <Button onClick={showMore} {...props}>
      <Icon value={IconArrowDown} />
      Show a few more
    </Button>
  );
}
