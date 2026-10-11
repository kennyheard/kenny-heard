/** Rating the Sustainable Web Design model (version 4) gives a page view, from A+ (best) to F. */
export type CarbonGrade = "A+" | "A" | "B" | "C" | "D" | "E" | "F";

/** How the site's hosting affects its carbon figure. */
export interface CarbonConfig {
  /** Whether The Green Web Foundation lists the site's hosting as powered by renewable or zero-carbon energy. */
  isGreenHosting: boolean;
}

/**
 * Energy each gigabyte transferred uses in the Sustainable Web Design model (version 4), in kilowatt-hours, split into
 * running and making each part of the system.
 */
const energyPerGigabyte = {
  operational: { dataCentre: 0.055, network: 0.059, device: 0.08 },
  embodied: { dataCentre: 0.012, network: 0.013, device: 0.081 },
};

/** Global average carbon intensity of electricity the model uses for every part, in grams per kilowatt-hour. */
const gridIntensity = 494;

/** Most grams of carbon dioxide a page view can produce for each rating, best first. */
const gradeLimits: [CarbonGrade, number][] = [
  ["A+", 0.04],
  ["A", 0.079],
  ["B", 0.145],
  ["C", 0.209],
  ["D", 0.278],
  ["E", 0.359],
];

/**
 * Rates a page view's carbon dioxide on the Sustainable Web Design model's scale (version 4).
 *
 * @param grams - The grams of carbon dioxide.
 * @returns The rating, from A+ to F.
 */
export function getCarbonGrade(grams: number) {
  return gradeLimits.find(([, limit]) => grams <= limit)?.[0] ?? "F";
}

/**
 * Creates the carbon calculation for the site's hosting, on the Sustainable Web Design model (version 4). Green
 * hosting removes only the energy that runs the data centre, since making its hardware still counts.
 *
 * @param carbonConfig - The hosting's details.
 * @returns A function that converts bytes into grams of carbon dioxide.
 */
export function defineCarbonConfig(carbonConfig: CarbonConfig) {
  const { isGreenHosting } = carbonConfig;
  const { operational, embodied } = energyPerGigabyte;

  const kilowattHoursPerGigabyte =
    (isGreenHosting ? 0 : operational.dataCentre) +
    operational.network +
    operational.device +
    embodied.dataCentre +
    embodied.network +
    embodied.device;

  /**
   * Converts bytes transferred into grams of carbon dioxide.
   *
   * @param bytes - The bytes transferred.
   * @returns The grams.
   */
  function getGrams(bytes: number) {
    return (bytes / 1e9) * kilowattHoursPerGigabyte * gridIntensity;
  }

  return { getGrams };
}
