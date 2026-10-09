import { ensure } from "@/lib/environment";

/** Path the Studio is served from. */
export const studioUrl = "/studio";

/** Route that enables draft mode. */
export const draftApiUrl = "/api/draft-mode/enable";

/** Sanity project ID. */
export const projectId = ensure(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "The `NEXT_PUBLIC_SANITY_PROJECT_ID` environment variable is required.",
);

/** Sanity dataset name. */
export const dataset = ensure(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "The `NEXT_PUBLIC_SANITY_DATASET` environment variable is required.",
);

/** Sanity API version, overridable through the environment. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01";
