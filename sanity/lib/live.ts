import type { QueryParams } from "next-sanity";
import { defineLive, resolvePerspectiveFromCookies } from "next-sanity/live";
import type { LivePerspective } from "next-sanity/live";
import { cookies, draftMode } from "next/headers";

import { client } from "@/sanity/lib/client";
import type { TypedQuery } from "@/sanity/lib/groq";
import { token } from "@/sanity/lib/token";

/** Sanity Live fetch result with its data typed by the query. */
type SanityFetchResult<T> = Omit<Awaited<ReturnType<typeof live.sanityFetch>>, "data"> & { data: T | null };

/** Perspective and stega options, resolved outside a cache boundary and passed into cached components. */
export interface DynamicFetchOptions {
  /** Perspective to read content from, such as published or drafts. */
  perspective: LivePerspective;
  /** Whether to encode strings with stega for visual editing. */
  stega: boolean;
}

/** Props for a cached component that renders a document. */
export type CachedDocumentProps = DynamicFetchOptions & {
  /** Whether draft mode is on, in which a missing document isn't a 404. */
  isDraftMode: boolean;
};

/** Query and parameters for a Sanity fetch. */
interface SanityFetchQueryArgs<T> {
  /** GROQ query to run. */
  query: TypedQuery<T>;
  /** Values for the query's parameters. */
  params?: QueryParams | Promise<QueryParams>;
}

/** Cache tag on every Sanity fetch, so publishing anything can refresh the whole site at once. */
export const contentTag = "content";

/** Sanity Live instance that fetches content and keeps it up to date. */
const live = defineLive({ client, serverToken: token, browserToken: token, strict: true });

/** Component that refreshes the page when its content changes, only rendered in draft mode. */
export const { SanityLive } = live;

/**
 * Resolves the perspective and stega options for the current request, which a cached component can't read itself.
 *
 * @returns The perspective and stega options.
 */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode();
  if (!isDraftMode) return { perspective: "published", stega: false };

  const cookieStore = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: cookieStore });

  return { perspective, stega: true };
}

/**
 * Fetches from Sanity, defaulting to published content without stega. It has no cache of its own, so call it inside a
 * `"use cache"` boundary, or it makes every route that renders the caller dynamic.
 *
 * @param args - The query, its parameters, and the perspective and stega options.
 * @returns The result, typed by the query.
 */
export async function sanityFetch<T>(args: SanityFetchQueryArgs<T> & Partial<DynamicFetchOptions>) {
  const { perspective = "published", stega = false } = args;
  const result = await live.sanityFetch({ ...args, perspective, stega, tags: [contentTag] });

  // oxlint-disable-next-line no-unsafe-type-assertion -- The query result is untyped, so T can't be verified.
  return result as SanityFetchResult<T>;
}

/**
 * Fetches from Sanity inside its own cache boundary, without stega, for places with no component to cache,
 * such as metadata, static parameters, and the sitemap. The perspective is required, because a page previewed
 * before it's ever been published resolves to nothing under the published one.
 *
 * @param args - The query, its parameters, and the perspective.
 * @returns The result, typed by the query.
 */
export async function sanityFetchCached<T>(args: SanityFetchQueryArgs<T> & { perspective: LivePerspective }) {
  "use cache";

  const result = await live.sanityFetch({ ...args, stega: false, tags: [contentTag] });

  // oxlint-disable-next-line no-unsafe-type-assertion -- The query result is untyped, so T can't be verified.
  return result as SanityFetchResult<T>;
}
