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
  // The pre-commit check already type-checks the whole project, so the build doesn't repeat it.
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbopackRustReactCompiler: true,
  },
};

export default withIcons()(config);
