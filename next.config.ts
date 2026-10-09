import { withIcons } from "@driftime/sanity-plugin-icon/next";
import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

/** Path the site serves its Sanity images from, for this project only. */
const imagesPath = `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`;

const config: NextConfig = {
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    default: sanity,
  },
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
  },
  rewrites() {
    return [
      {
        source: `${imagesPath}/:path*`,
        destination: `https://cdn.sanity.io${imagesPath}/:path*`,
      },
    ];
  },
  headers() {
    return [
      {
        source: `${imagesPath}/:path*`,
        headers: [{ key: "x-vercel-enable-rewrite-caching", value: "1" }],
      },
    ];
  },
};

export default withIcons()(config);
