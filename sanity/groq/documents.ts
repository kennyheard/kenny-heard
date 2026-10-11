import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";

import { linkFragment, routeParamsFragment } from "@/config/links";
import type { SanityFeedItem } from "@/lib/feed";
import {
  extendedPortableTextFragment,
  navigationMenuFragment,
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
    endNote { ..., body[] { ..., ${standardPortableTextFragment} } }
  }
`);

/** Articles and entries, newest first, with only the fields the feed shows and the text of each article's body. */
export const feedQuery = defineTypedQuery<SanityFeedItem[]>(`
  *[_type in ["article", "entry"] && defined(date)] | order(date desc) {
    _id,
    _type,
    icon,
    title,
    description,
    date,
    ${routeParamsFragment},
    link { ..., ${linkFragment} },
    comingSoon,
    _type == "article" => { "body": body[_type == "block"] { _type, children[] { _type, text } } }
  }
`);

/** Article matching `$slug`, with the links and images in its body. */
export const articleQuery = defineTypedQuery<SanityArticle>(`
  *[_type == "article" && slug.current == $slug][0] {
    ...,
    ${routeParamsFragment},
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

/** Icon for the social preview image of the singleton of type `$type`. */
export const singletonSeoIconQuery = defineTypedQuery<SanityIcon>(`*[_type == $type][0].seoIcon`);

/** Icon for the social preview image of the article matching `$slug`. */
export const articleSeoIconQuery = defineTypedQuery<SanityIcon>(
  `*[_type == "article" && slug.current == $slug][0].seoIcon`,
);
