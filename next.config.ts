import { withIcons } from "@driftime/sanity-plugin-icon/next";
import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

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
};

export default withIcons()(config);
