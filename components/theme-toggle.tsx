"use client";

import { IconMoon, IconSun } from "@central-icons-react/round-outlined-radius-2-stroke-1";

import { Button } from "@/components/button";
import type { ButtonProps } from "@/components/button";
import { Icon } from "@/components/icon";
import { useSystemTheme } from "@/hooks/use-system-theme";
import { toggleTheme } from "@/lib/theme";

export type ThemeToggleProps = Omit<ButtonProps, "children" | "onClick">;

export function ThemeToggle(props: ThemeToggleProps) {
  useSystemTheme();

  return (
    <Button onClick={toggleTheme} theme="icon" {...props}>
      <span className="dark:hidden">
        <Icon value={IconMoon} />
        <span className="sr-only">Switch to dark mode</span>
      </span>
      <span className="hidden dark:block">
        <Icon value={IconSun} />
        <span className="sr-only">Switch to light mode</span>
      </span>
    </Button>
  );
}
