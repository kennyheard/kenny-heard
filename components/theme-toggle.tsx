"use client";

import { IconMoon, IconSun } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { useEffect } from "react";

import { Button } from "@/components/button";
import type { ButtonProps } from "@/components/button";
import { Icon } from "@/components/icon";
import { darkSchemeQuery, themeStorageKey } from "@/config/theme";

export type ThemeToggleProps = Omit<ButtonProps, "children" | "onPress">;

/** Sets the browser's theme colour to the page's current background, so its toolbars follow the theme. */
function updateThemeColor() {
  const color = getComputedStyle(document.documentElement).backgroundColor;
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.setAttribute("content", color);
}

/** Switches between light and dark mode and remembers the choice, so the system's setting stops applying. */
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");
  updateThemeColor();
}

export function ThemeToggle(props: ThemeToggleProps) {
  useEffect(() => {
    const darkScheme = matchMedia(darkSchemeQuery);

    function handleSchemeChange(event: MediaQueryListEvent) {
      if (localStorage.getItem(themeStorageKey) !== null) return;
      document.documentElement.classList.toggle("dark", event.matches);
      updateThemeColor();
    }

    darkScheme.addEventListener("change", handleSchemeChange);

    return () => {
      darkScheme.removeEventListener("change", handleSchemeChange);
    };
  }, []);

  return (
    <Button theme="icon" onPress={toggleTheme} {...props}>
      <span className="dark:hidden">
        <Icon icon={IconMoon} />
        <span className="sr-only">Switch to dark mode</span>
      </span>
      <span className="hidden dark:block">
        <Icon icon={IconSun} />
        <span className="sr-only">Switch to light mode</span>
      </span>
    </Button>
  );
}
