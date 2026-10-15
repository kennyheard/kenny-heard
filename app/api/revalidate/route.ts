import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import { ensure } from "@/lib/environment";
import { contentTag } from "@/sanity/lib/live";

/**
 * Refreshes every page's Sanity content when the Studio's publish webhook calls with a valid signature.
 *
 * @param request - The webhook's request.
 * @returns What was refreshed, or an error when the signature is invalid.
 * @throws When the webhook secret isn't set.
 */
export async function POST(request: NextRequest) {
  const secret = ensure(
    process.env.SANITY_REVALIDATE_SECRET,
    "The `SANITY_REVALIDATE_SECRET` environment variable is required.",
  );
  const { isValidSignature } = await parseBody(request, secret, true);
  if (isValidSignature !== true) return new Response("Invalid signature.", { status: 401 });

  revalidateTag(contentTag, { expire: 0 });

  return Response.json({ revalidated: contentTag });
}
