import { defineCarbonConfig } from "@/lib/carbon";

/** Carbon calculation for the site's hosting, which The Green Web Foundation doesn't list as green. */
const config = defineCarbonConfig({
  isGreenHosting: false,
});

export const { getGrams } = config;
