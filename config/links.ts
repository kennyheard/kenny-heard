import { defineLinkConfig } from "@driftime/sanity-plugin-link/render";

import { routes } from "@/config/routes";
import { baseUrl } from "@/lib/environment";

/** Link resolvers and GROQ fragments bound to the site's routes and base URL. */
const config = defineLinkConfig({ baseUrl, routes });

export const { resolveLink, resolveRoute, routeParamsFragment, linkFragment } = config;
