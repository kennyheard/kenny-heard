import { linkFragment, routeParamsFragment } from "@/config/links";
import {
  extendedPortableTextFragment,
  navigationMenuFragment,
  seoFieldsFragment,
  seoSettingsFragment,
  standardPortableTextFragment,
} from "@/sanity/groq/fragments";
import { defineTypedQuery } from "@/sanity/lib/groq";
import type { SanityArticle } from "@/sanity/schemas/documents/collections/article";
import type { SanityNavigation } from "@/sanity/schemas/documents/globals/navigation";
import type { SanitySeoSettings, SanitySettings } from "@/sanity/schemas/documents/globals/settings";
import type { SanityColophon } from "@/sanity/schemas/documents/singletons/colophon";
import type { SanityHome } from "@/sanity/schemas/documents/singletons/home";

/** Home document with the links in its end note. */
export const homeQuery = defineTypedQuery<SanityHome>(`
  *[_type == "home"][0] {
    ...,
    ${routeParamsFragment},
    endNote { ..., body[] { ..., ${standardPortableTextFragment} } },
    ${seoFieldsFragment}
  }
`);

/** Article matching `$slug`, with the links and images in its body. */
export const articleQuery = defineTypedQuery<SanityArticle>(`
  *[_type == "article" && slug.current == $slug][0] {
    ...,
    ${routeParamsFragment},
    body[] { ..., ${extendedPortableTextFragment} },
    ${seoFieldsFragment}
  }
`);

/** Colophon document with its tools' links. */
export const colophonQuery = defineTypedQuery<SanityColophon>(`
  *[_type == "colophon"][0] {
    ...,
    ${routeParamsFragment},
    sections[] { ..., tools[] { ..., link { ..., ${linkFragment} } } },
    ${seoFieldsFragment}
  }
`);

/** Navigation document with its menu and social links. */
export const navigationQuery = defineTypedQuery<SanityNavigation>(`
  *[_type == "navigation"][0] {
    ...,
    footer { ..., ${navigationMenuFragment} },
    social[] { ..., link { ..., ${linkFragment} } }
  }
`);

/** Name and role shown at the top of every page. */
export const identityQuery = defineTypedQuery<Pick<SanitySettings, "name" | "role">>(
  `*[_type == "settings"][0] { name, role[] { ..., ${standardPortableTextFragment} } }`,
);

/** Site-wide SEO settings. */
export const settingsQuery = defineTypedQuery<SanitySeoSettings>(
  `*[_type == "settings"][0] { ${seoSettingsFragment} }`,
);
