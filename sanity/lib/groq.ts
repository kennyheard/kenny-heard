import { defineQuery } from "next-sanity";

/** GROQ query string that carries the type of its result. */
export type TypedQuery<T> = string & { readonly __result?: T };

/**
 * Defines a GROQ query typed with its result, so fetches infer the result type.
 *
 * @param query - The GROQ query.
 * @returns The query, typed with its result.
 */
export function defineTypedQuery<T>(query: string): TypedQuery<T> {
  return defineQuery(query);
}
