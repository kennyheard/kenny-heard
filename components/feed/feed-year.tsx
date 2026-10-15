"use client";

import { use } from "react";
import type { ReactNode } from "react";

import { FeedPagesContext } from "@/contexts/feed-pages";

export interface FeedYearProps {
  start: number;
  children: ReactNode;
}

export function FeedYear({ start, children }: FeedYearProps) {
  const { visibleCount } = use(FeedPagesContext);

  if (start >= visibleCount) return null;

  return <>{children}</>;
}
