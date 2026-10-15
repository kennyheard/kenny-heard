import { linkFragment } from "@/config/links";
import { wordsPerMinute } from "@/lib/portable-text";

/** Reading time a query adds alongside a document's body. */
export interface SanityReadingTime {
  /** How long the body takes to read, in whole minutes, at least one. */
  readingMinutes?: number;
}

/** Expands an image's asset reference into the asset's id, which encodes its size, and its blurred placeholder. */
export const imageAssetFragment = `asset-> { _id, metadata { lqip } }`;

/** Expands the links in a text block. */
export const standardPortableTextFragment = `markDefs[] { ..., ${linkFragment} }`;

/** Expands the links and images in extended portable text. */
export const extendedPortableTextFragment = `
  _type == "block" => { ..., ${standardPortableTextFragment} },
  _type == "accessibleImage" => { ..., ${imageAssetFragment} }
`;

/** Expands a navigation menu's links. */
export const navigationMenuFragment = `links[] { ..., ${linkFragment} }`;

/** SEO fields from the settings document. */
export const seoSettingsFragment = `seoTitle, seoSuffix, seoDescription`;

/** Works out how long a body takes to read, counting one more word at each break between blocks, where the text runs on. */
export const readingMinutesFragment = `"readingMinutes": math::max([1, round((count(string::split(pt::text(body), " ")) + count(body[_type == "block"]) - 1) / ${wordsPerMinute})])`;
