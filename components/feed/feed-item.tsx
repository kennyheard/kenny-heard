"use client";

import { use } from "react";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { FeedPagesContext } from "@/contexts/feed-pages";

export type FeedItemProps = ComponentProps<"div"> &
  VariantProps<typeof variants> & {
    index: number;
  };

export const variants = tv({
  base: "focus:outline-none",
});

export function FeedItem({ index, className, ...props }: FeedItemProps) {
  const { visibleCount, revealedIndex } = use(FeedPagesContext);
  const isFirstRevealed = index === revealedIndex;

  if (index >= visibleCount) return null;

  return (
    <div
      ref={isFirstRevealed ? (node) => node?.focus() : undefined}
      tabIndex={isFirstRevealed ? -1 : undefined}
      className={variants({ className })}
      {...props}
    />
  );
}
