"use client";

import { IconShareOs } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { useState } from "react";

import { Button } from "@/components/button";
import type { ButtonProps } from "@/components/button";
import { Icon } from "@/components/icon";

export type ShareButtonProps = Omit<ButtonProps, "children" | "onPress"> & {
  title: string;
};

/** How long the button shows that it copied the link, in milliseconds. */
const copiedDuration = 2000;

/**
 * Opens the browser's share sheet for a page, or copies its address where there's no share sheet.
 *
 * @param title - The page's title.
 * @param url - The page's address.
 * @returns Whether the address was copied rather than shared.
 */
async function sharePage(title: string, url: string) {
  try {
    await navigator.share({ title, url });

    return false;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return false;

    await navigator.clipboard.writeText(url);

    return true;
  }
}

export function ShareButton({ title, ...props }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  async function share() {
    if (!(await sharePage(title, globalThis.location.href))) return;

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, copiedDuration);
  }

  return (
    <Button
      onPress={() => {
        void share();
      }}
      {...props}
    >
      <Icon icon={IconShareOs} size="1rem" tone="inherit" />
      <span aria-live="polite">{isCopied ? "Link copied" : "Share"}</span>
    </Button>
  );
}
