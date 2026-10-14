import { resolveRoute } from "@/config/links";
import type { SanityRoute } from "@/config/routes";
import { sweepSocialImages } from "@/lib/social-image-storage";
import { isDefined } from "@/lib/utils";
import { createStaticParamsQuery } from "@/sanity/groq/routes";
import { client } from "@/sanity/lib/client";

const articles = await client.fetch<{ slug: string }[]>(
  createStaticParamsQuery("article"),
  {},
  { perspective: "published", stega: false, useCdn: false },
);
// Every page with an `opengraph-image` route, so a new one needs adding here too.
const routes: SanityRoute[] = [
  { _type: "home" },
  { _type: "colophon" },
  ...articles.map(({ slug }) => ({ _type: "article" as const, slug })),
];

await sweepSocialImages(routes.map((route) => resolveRoute(route)).filter((path) => isDefined(path)));
