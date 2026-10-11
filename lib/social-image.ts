import { readFile } from "node:fs/promises";
import path from "node:path";

import { toPlainText } from "@portabletext/react";

import { site } from "@/config/metadata";
import { socialImageFontFiles } from "@/config/social-images";
import { isDefined } from "@/lib/utils";
import { identityQuery } from "@/sanity/groq/documents";
import { sanityFetchCached } from "@/sanity/lib/live";

/** Size social platforms expect, in pixels. */
export const socialImageSize = { width: 1200, height: 630 };

/** Fonts for drawing social images. */
export const socialImageFonts = await Promise.all(
  socialImageFontFiles.map(async ({ file, ...font }) => ({
    ...font,
    data: await readFile(path.join(process.cwd(), "app/fonts", file)),
  })),
);

/**
 * Fetches the name and profession shown at the top of every social image, from the published settings.
 *
 * @returns The name, and the profession as plain text or undefined when there is none.
 */
export async function getSocialIdentity() {
  const { data: identity } = await sanityFetchCached({ query: identityQuery, perspective: "published" });
  const { name, profession } = identity ?? {};

  return { name: name ?? site.name, profession: isDefined(profession) ? toPlainText(profession) : undefined };
}
