"use client";

import type { ReactNode } from "react";

import { FeedPagesContext } from "@/contexts/feed-pages";
import { useFeedPages } from "@/hooks/use-feed-pages";

export interface FeedPagesProps {
  count: number;
  pageSize: number;
  initialCount: number;
  hasEndNote: boolean;
  children: ReactNode;
}

export function FeedPages({ count, pageSize, initialCount, hasEndNote, children }: FeedPagesProps) {
  const pages = useFeedPages(count, pageSize, initialCount, hasEndNote);

  return <FeedPagesContext value={pages}>{children}</FeedPagesContext>;
}
