import { isDefined } from "@/lib/utils";

/** Kinds of request that load the files every page shares: scripts, stylesheets, and fonts. */
const sharedInitiators = new Set(["script", "link", "css"]);

/**
 * Checks whether a request fetched a page's data while moving between pages within the site.
 *
 * @param url - Address of the request.
 * @param pathname - Path of the page.
 * @returns Whether the request fetched that page's data.
 */
function isPageData(url: string, pathname: string) {
  const { pathname: requestPath, searchParams } = new URL(url);

  return searchParams.has("_rsc") && requestPath === pathname;
}

/**
 * Adds up what requests would transfer with nothing cached: each file's compressed size once, plus the average size of
 * the headers measured on requests that came over the network.
 *
 * @param entries - The requests.
 * @returns The bytes.
 */
function sumEncodedBytes(entries: PerformanceResourceTiming[]) {
  const files = [...new Map(entries.map((entry) => [entry.name, entry])).values()];
  const fetched = files.filter(({ transferSize, encodedBodySize }) => transferSize > encodedBodySize);
  const headerBytes = isDefined(fetched)
    ? fetched.reduce((total, { transferSize, encodedBodySize }) => total + transferSize - encodedBodySize, 0) /
      fetched.length
    : 0;

  return files.reduce((total, { encodedBodySize }) => total + encodedBodySize + headerBytes, 0);
}

/**
 * Works out what the current page would transfer on a visit with nothing cached: its document or data, the files
 * every page shares, and its own images.
 *
 * @param resources - Every request the visit has made.
 * @param pathname - Path of the current page.
 * @param isFirstPage - Whether the page was loaded directly rather than reached from another page.
 * @returns The bytes.
 */
export function getPageBytes(resources: PerformanceResourceTiming[], pathname: string, isFirstPage: boolean) {
  const imageSources = new Set(Array.from(document.images, ({ currentSrc }) => currentSrc));
  const content = isFirstPage
    ? performance.getEntriesByType("navigation").filter((entry) => entry instanceof PerformanceResourceTiming)
    : resources.filter(({ name }) => isPageData(name, pathname));
  const shared = resources.filter(({ initiatorType }) => sharedInitiators.has(initiatorType));
  const images = resources.filter(({ name }) => imageSources.has(name));

  return sumEncodedBytes([...content, ...shared, ...images]);
}
