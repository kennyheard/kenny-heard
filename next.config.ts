import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const config: NextConfig = {
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

export default config;
