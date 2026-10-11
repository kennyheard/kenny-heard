/**
 * Copies text to the clipboard.
 *
 * @param text - The text to copy.
 * @returns Whether the text was copied.
 */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return false;
  }
}
