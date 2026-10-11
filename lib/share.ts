import { copyText } from "@/lib/clipboard";

/**
 * Opens the browser's share sheet for a page, or copies its address where there's no share sheet.
 *
 * @param title - The page's title.
 * @param url - The page's address.
 * @returns Whether the address was copied rather than shared.
 */
export async function sharePage(title: string, url: string) {
  try {
    await navigator.share({ title, url });

    return false;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return false;
  }

  return copyText(url);
}
