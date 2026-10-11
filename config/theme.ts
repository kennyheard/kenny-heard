/** Local storage key holding the reader's chosen theme, either `light` or `dark`. */
export const themeStorageKey = "theme";

/** Media query matching a system set to light mode. */
export const lightSchemeQuery = "(prefers-color-scheme: light)";

/** Media query matching a system set to dark mode. */
export const darkSchemeQuery = "(prefers-color-scheme: dark)";

/** Colours in each mode, written out for what can't read the stylesheet: the manifest, browser toolbars, and social images. */
export const themeColors = {
  light: { background: "#fafafa", muted: "#71717b" },
  dark: { background: "#18181b" },
};

/**
 * Script that applies the chosen theme, or the system's when none is chosen, before the page first paints, so it
 * never flashes the wrong one.
 */
export const themeScript = `(() => {
  try {
    const theme = localStorage.getItem("${themeStorageKey}");
    const isDark = theme === null ? matchMedia("${darkSchemeQuery}").matches : theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    const color = getComputedStyle(document.documentElement).backgroundColor;
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.setAttribute("content", color);
  } catch {}
})();`;
