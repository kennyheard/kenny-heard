import { stegaClean } from "next-sanity";

import { convertCase } from "@/lib/utils";

/** Average adult reading speed for prose, in words per minute. */
export const wordsPerMinute = 230;

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
 * Writes a reading time in words.
 *
 * @param minutes - The reading time in minutes.
 * @returns The reading time, such as "12 minutes".
 */
export function formatReadingTime(minutes: number) {
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}
