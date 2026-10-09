import { linkFragment } from "@/config/links";

/** Expands an image's asset reference into the asset's id, which encodes its size, and its blurred placeholder. */
export const imageAssetFragment = `asset-> { _id, metadata { lqip } }`;

/** Expands an image's asset reference into the asset's id alone, for images too small to need a blurred placeholder. */
export const imageAssetIdFragment = `asset-> { _id }`;

/** Expands the links in a text block. */
export const standardPortableTextFragment = `markDefs[] { ..., ${linkFragment} }`;

/** Expands the links and images in extended portable text. */
export const extendedPortableTextFragment = `
  _type == "block" => { ..., ${standardPortableTextFragment} },
  _type == "accessibleImage" => { ..., ${imageAssetFragment} }
`;

/** Expands a navigation menu's links. */
export const navigationMenuFragment = `links[] { ..., ${linkFragment} }`;

/** Expands a document's SEO image. */
export const seoFieldsFragment = `seoImage { ..., ${imageAssetFragment} }`;

/** SEO fields from the settings document. */
export const seoSettingsFragment = `seoTitle, seoSuffix, seoDescription, seoImage { ..., ${imageAssetFragment} }`;
