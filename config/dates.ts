import { defineDateConfig } from "@/lib/dates";

/** Date format used across the site. */
const config = defineDateConfig({
  locale: "en-GB",
  format: { day: "numeric", month: "long", year: "numeric" },
});

export const { getDatestamp } = config;
