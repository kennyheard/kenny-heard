import { isDefined } from "@/lib/utils";

/** How dates are formatted for display. */
export interface DateConfig {
  /** BCP 47 language tag to format dates for. */
  locale: Intl.UnicodeBCP47LocaleIdentifier;
  /** Parts of the date to show, in UTC unless a time zone is given, so every reader sees the same day. */
  format: Intl.DateTimeFormatOptions;
}

/**
 * Parses a date string.
 *
 * @param dateString - The string to parse.
 * @returns The date, or undefined when the string is absent or not a valid date.
 */
function getDate(dateString?: string) {
  if (!isDefined(dateString)) return undefined;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return undefined;

  return date;
}

/**
 * Creates date helpers bound to a locale and format.
 *
 * @param dateConfig - The locale and format options.
 * @returns Helpers that format dates with them.
 */
export function defineDateConfig(dateConfig: DateConfig) {
  const { locale, format } = dateConfig;

  /**
   * Formats a date string for display.
   *
   * @param dateString - The string to format.
   * @returns The formatted date, or undefined when the string is absent or not a valid date.
   */
  function getDatestamp(dateString?: string) {
    return getDate(dateString)?.toLocaleDateString(locale, {
      timeZone: "UTC",
      ...format,
    });
  }

  return { getDatestamp };
}
