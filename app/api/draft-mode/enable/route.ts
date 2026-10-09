import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

/** Enables draft mode when requested by the Studio. */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
