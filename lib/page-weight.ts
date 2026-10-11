import { isDefined } from "@/lib/utils";

/** Size details of a request, as the browser reports them. */
type RequestSizes = Pick<PerformanceResourceTiming, "name" | "encodedBodySize" | "transferSize">;

/** Kinds of request that load the files every page shares: scripts, stylesheets, and fonts. */
const sharedInitiators = new Set(["script", "link", "css"]);

/** Local storage key holding each file's compressed size, keyed by its address. */
const fileSizesKey = "file-sizes";

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
function sumEncodedBytes(entries: RequestSizes[]) {
  const files = [...new Map(entries.map((entry) => [entry.name, entry])).values()];
  const fetched = files.filter(({ transferSize, encodedBodySize }) => transferSize > encodedBodySize);
  const headerBytes = isDefined(fetched)
    ? fetched.reduce((total, { transferSize, encodedBodySize }) => total + transferSize - encodedBodySize, 0) /
      fetched.length
    : 0;

  return files.reduce((total, { encodedBodySize }) => total + encodedBodySize + headerBytes, 0);
}

/**
 * Reads the compressed sizes remembered from earlier visits.
 *
 * @returns Sizes keyed by address, empty when none are remembered or storage can't be read.
 */
function readFileSizes() {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(fileSizesKey) ?? "{}");

    return new Map(
      Object.entries(stored ?? {}).filter((entry): entry is [string, number] => typeof entry[1] === "number"),
    );
  } catch {
    return new Map<string, number>();
  }
}

/**
 * Fills in sizes the browser reported as 0, which Safari does for files it serves from its cache, from the sizes
 * remembered when those files last downloaded, and remembers any new ones.
 *
 * @param entries - The requests.
 * @returns The requests with their sizes filled in.
 */
function withRememberedSizes(entries: RequestSizes[]) {
  const sizes = readFileSizes();
  const filled = entries.map(({ name, encodedBodySize, transferSize }) => ({
    name,
    encodedBodySize: encodedBodySize > 0 ? encodedBodySize : (sizes.get(name) ?? 0),
    transferSize,
  }));

  for (const { name, encodedBodySize } of filled) {
    if (encodedBodySize > 0) sizes.set(name, encodedBodySize);
  }

  try {
    localStorage.setItem(fileSizesKey, JSON.stringify(Object.fromEntries(sizes)));
  } catch {
    // Storage can be full or blocked, as in private browsing, and the figure works without it.
  }

  return filled;
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

  return sumEncodedBytes(withRememberedSizes([...content, ...shared, ...images]));
}
