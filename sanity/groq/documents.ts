import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";

import { linkFragment, routeParamsFragment } from "@/config/links";
import type { SanityFeedItem } from "@/lib/feed";
import {
  extendedPortableTextFragment,
  navigationMenuFragment,
  readingMinutesFragment,
  seoSettingsFragment,
  standardPortableTextFragment,
} from "@/sanity/groq/fragments";
import type { SanityReadingTime } from "@/sanity/groq/fragments";
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
    endNote { ..., body[] { ..., ${standardPortableTextFragment} } }
  }
`);

/** Articles and entries, newest first, shaped as the entries the feed shows. */
export const feedQuery = defineTypedQuery<SanityFeedItem[]>(`
  *[_type in ["article", "entry"] && defined(date)] | order(date desc) {
    _id,
    _type,
    icon,
    title,
    description,
    date,
    "isComingSoon": comingSoon == true,
    _type == "article" => {
      "link": { "_type": "link", "type": "page", "reference": { _id, _type, title, ${routeParamsFragment} } },
      ${readingMinutesFragment}
    },
    _type == "entry" && comingSoon != true => { link { ..., ${linkFragment} } }
  }
`);

/** Article matching `$slug`, with the links and images in its body, and how long it takes to read. */
export const articleQuery = defineTypedQuery<SanityArticle & SanityReadingTime>(`
  *[_type == "article" && slug.current == $slug][0] {
    ...,
    ${routeParamsFragment},
    ${readingMinutesFragment},
    body[] { ..., ${extendedPortableTextFragment} }
  }
`);

/** Colophon document with its tools' links. */
export const colophonQuery = defineTypedQuery<SanityColophon>(`
  *[_type == "colophon"][0] {
    ...,
    ${routeParamsFragment},
    sections[] { ..., tools[] { ..., link { ..., ${linkFragment} } } }
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

/** Name and profession shown at the top of every page. */
export const identityQuery = defineTypedQuery<Pick<SanitySettings, "name" | "profession">>(
  `*[_type == "settings"][0] { name, profession[] { ..., ${standardPortableTextFragment} } }`,
);

/** Site-wide SEO settings. */
export const settingsQuery = defineTypedQuery<SanitySeoSettings>(
  `*[_type == "settings"][0] { ${seoSettingsFragment} }`,
);

/** Icon chosen for the social preview image of the singleton of type `$type`. */
export const singletonSeoIconQuery = defineTypedQuery<SanityIcon>(`*[_type == $type][0].seoIcon`);

/** Feed icon and social preview icon of the article matching `$slug`. */
export const articleIconsQuery = defineTypedQuery<Pick<SanityArticle, "icon" | "seoIcon">>(
  `*[_type == "article" && slug.current == $slug][0] { icon, seoIcon }`,
);
