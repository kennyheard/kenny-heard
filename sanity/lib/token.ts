import "server-only";
import { ensure } from "@/lib/environment";

/** Viewer token for reading drafts, also sent to the browser in draft mode. */
export const token = ensure(
  process.env.SANITY_API_READ_TOKEN,
  "The `SANITY_API_READ_TOKEN` environment variable is required.",
);
