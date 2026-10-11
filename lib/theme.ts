import { themeStorageKey } from "@/config/theme";
import { isDefined } from "@/lib/utils";

/** Sets the browser's theme colour to the page's current background, so its toolbars follow the theme. */
function updateThemeColor() {
  const color = getComputedStyle(document.documentElement).backgroundColor;
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.setAttribute("content", color);
}

/** Switches between light and dark mode and remembers the choice, so the system's setting stops applying. */
export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");
  updateThemeColor();
}

/**
 * Applies the system's light or dark setting, unless the reader has chosen a theme.
 *
 * @param isDark - Whether the system is set to dark mode.
 */
export function applySystemTheme(isDark: boolean) {
  if (isDefined(localStorage.getItem(themeStorageKey))) return;

  document.documentElement.classList.toggle("dark", isDark);
  updateThemeColor();
}
