import type { inferParserType } from "nuqs/server";

import { defineSearchParamsConfig } from "@/lib/search-params";

// oxlint-disable-next-line no-generated-empty-object-type -- Empty until the site adds its first parameter.
export type SearchParamKey = keyof inferParserType<typeof searchParams>;

// oxlint-disable-next-line no-generated-empty-object-type -- Empty until the site adds its first parameter.
export type SearchParams = Partial<inferParserType<typeof searchParams>>;

/** Search parameters the site reads, keyed by name. */
const config = defineSearchParamsConfig({});

export const { searchParams, searchParamsCache, loadSearchParams, serialize } = config;
