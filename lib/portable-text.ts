import { toPlainText } from "@portabletext/react";
import { stegaClean } from "next-sanity";

import { convertCase, isDefined } from "@/lib/utils";

/** Average adult reading speed for prose, in words per minute. */
const wordsPerMinute = 230;

/**
 * Builds a heading's anchor id from its text, without stega characters or punctuation.
 *
 * @param text - The heading's text.
 * @returns The id.
 */
export function getAnchorId(text: string) {
  return convertCase(stegaClean(text).replaceAll(/[^\p{L}\p{N}\s-]/gu, ""), "kebab");
}

/**
 * Estimates how long Portable Text takes to read, from its text blocks.
 *
 * @param blocks - The Portable Text.
 * @returns The reading time in whole minutes, at least one.
 */
export function getReadingMinutes(blocks: Parameters<typeof toPlainText>[0]) {
  const words = toPlainText(blocks)
    .split(/\s+/u)
    .filter((word) => isDefined(word)).length;

  return Math.max(1, Math.round(words / wordsPerMinute));
}

/**
 * Writes a reading time in words.
 *
 * @param minutes - The reading time in minutes.
 * @returns The reading time, such as "12 minutes".
 */
export function formatReadingTime(minutes: number) {
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}
