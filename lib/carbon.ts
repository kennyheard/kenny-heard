/** Rating the Sustainable Web Design model (version 4) gives a visit, from A+ (best) to F. */
export type CarbonGrade = "A+" | "A" | "B" | "C" | "D" | "E" | "F";

/**
 * Grams of carbon dioxide per byte in the Sustainable Web Design model (version 4): 0.3kWh per gigabyte at 494g per
 * kilowatt-hour, with the hosting counted as not green.
 */
export const gramsPerByte = (0.3 * 494) / 1e9;

/** Most grams of carbon dioxide a visit can produce for each rating, best first. */
const gradeLimits: [CarbonGrade, number][] = [
  ["A+", 0.04],
  ["A", 0.079],
  ["B", 0.145],
  ["C", 0.209],
  ["D", 0.278],
  ["E", 0.359],
];

/**
 * Rates a visit's carbon dioxide on the Sustainable Web Design model's scale (version 4).
 *
 * @param grams - The grams of carbon dioxide.
 * @returns The rating, from A+ to F.
 */
export function getCarbonGrade(grams: number) {
  return gradeLimits.find(([, limit]) => grams <= limit)?.[0] ?? "F";
}
