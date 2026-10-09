import { createLoader, createSearchParamsCache, createSerializer } from "nuqs/server";
import type { ParserMap } from "nuqs/server";

/**
 * Creates search parameter helpers bound to a set of parsers.
 *
 * @param searchParamsConfig - The parsers, keyed by parameter name.
 * @returns The parsers and helpers that read and write them.
 */
export function defineSearchParamsConfig<T extends ParserMap>(searchParamsConfig: T) {
  /** Search parameter parsers keyed by name. */
  const searchParams = searchParamsConfig;

  /**
   * Search parameters parsed once in a page and readable from any server component beneath it. Not
   * available in `generateMetadata`.
   */
  const searchParamsCache = createSearchParamsCache(searchParams);

  /** Parses search parameters from a query string, URL, or request, replacing invalid values with defaults. */
  const loadSearchParams = createLoader(searchParams);

  /** Adds search parameters to a URL, keeping existing ones and removing any set to null. */
  const serialize = createSerializer(searchParams);

  return { searchParams, searchParamsCache, loadSearchParams, serialize };
}
