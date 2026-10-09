import { routeParamsFragment } from "@/config/links";
import {
  contentFragment,
  imageAssetFragment,
  navigationMenuFragment,
  seoFieldsFragment,
  seoSettingsFragment,
  standardPortableTextFragment,
} from "@/sanity/groq/fragments";
import { defineTypedQuery } from "@/sanity/lib/groq";
import type { SanityPage } from "@/sanity/schemas/documents/collections/page";
import type { SanityNavigation } from "@/sanity/schemas/documents/globals/navigation";
import type { SanitySeoSettings } from "@/sanity/schemas/documents/globals/settings";
import type { SanityTemplates } from "@/sanity/schemas/documents/globals/templates";
import type { SanityHome } from "@/sanity/schemas/documents/singletons/home";

/** Home document with its links and images. */
export const homeQuery = defineTypedQuery<SanityHome>(`
  *[_type == "home"][0] {
    ...,
    ${routeParamsFragment},
    introduction[] { ..., ${standardPortableTextFragment} },
    image { ..., ${imageAssetFragment} },
    ${seoFieldsFragment}
  }
`);

/** Page matching `$slug`, with its links and images. */
export const pageQuery = defineTypedQuery<SanityPage>(`
  *[_type == "page" && slug.current == $slug][0] {
    ...,
    ${routeParamsFragment},
    content[] { ..., ${contentFragment} },
    ${seoFieldsFragment}
  }
`);

/** Navigation document with its menu links. */
export const navigationQuery = defineTypedQuery<SanityNavigation>(`
  *[_type == "navigation"][0] {
    ...,
    header { ..., ${navigationMenuFragment} }
  }
`);

/** Templates document. */
export const templatesQuery = defineTypedQuery<SanityTemplates>(`*[_type == "templates"][0]`);

/** Site-wide SEO settings. */
export const settingsQuery = defineTypedQuery<SanitySeoSettings>(
  `*[_type == "settings"][0] { ${seoSettingsFragment} }`,
);
