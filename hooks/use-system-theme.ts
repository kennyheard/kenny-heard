import { useEffect } from "react";

import { darkSchemeQuery } from "@/config/theme";
import { applySystemTheme } from "@/lib/theme";

/** Follows changes to the system's light or dark setting for as long as the reader hasn't chosen a theme. */
export function useSystemTheme() {
  useEffect(() => {
    const darkScheme = matchMedia(darkSchemeQuery);

    function handleSchemeChange(event: MediaQueryListEvent) {
      applySystemTheme(event.matches);
    }

    darkScheme.addEventListener("change", handleSchemeChange);

    return () => {
      darkScheme.removeEventListener("change", handleSchemeChange);
    };
  }, []);
}
