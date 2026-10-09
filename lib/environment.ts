/**
 * Checks that a required environment variable is set.
 *
 * @param value - The variable's value.
 * @param error - The message to throw when it is empty or unset.
 * @returns The value.
 * @throws When the value is empty or unset.
 */
export function ensure(value: string | undefined, error: string) {
  // Checked by hand because `lib/utils.ts` imports this file, so using `isDefined` would create a circular import.
  if (value === undefined || value.trim() === "") throw new Error(error);

  return value;
}

/** Whether this is a production deployment. */
export const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

/** Whether this is a preview deployment. */
export const isStaging = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

/** Whether this is neither a production nor a preview deployment. */
export const isDevelopment = !(isProduction || isStaging);

/** Origin the site is served from, forced to HTTPS outside development. */
export const baseUrl = (() => {
  const url = ensure(
    [process.env.NEXT_PUBLIC_BASE_URL, process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL]
      // Checked by hand because `lib/utils.ts` imports this file, so using `isDefined` would create a circular import.
      .find((value) => value !== undefined && value.trim() !== "")
      ?.replace(/\/+$/u, ""),
    "The `NEXT_PUBLIC_BASE_URL` environment variable is required.",
  );

  if (url.startsWith("https://")) return url;
  if (url.startsWith("http://") && isDevelopment) return url;

  const protocol = isDevelopment ? "http" : "https";
  const host = url.replace(/^http:\/\//u, "");

  return `${protocol}://${host}`;
})();
