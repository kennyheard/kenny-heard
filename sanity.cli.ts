import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

// Loaded before anything reads the environment, so nothing may be imported here that does so at module scope.
loadEnvConfig(import.meta.dirname, true, { info: console.info, error: console.error });

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
