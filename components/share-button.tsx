"use client";

import { IconShareOs } from "@central-icons-react/round-outlined-radius-2-stroke-1";

import { Button } from "@/components/button";
import type { ButtonProps } from "@/components/button";
import { Icon } from "@/components/icon";
import { useCopied } from "@/hooks/use-copied";
import { copyText } from "@/lib/clipboard";

export type ShareButtonProps = Omit<ButtonProps, "children" | "onPress"> & {
  title: string;
};

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
  }

  return copyText(url);
}

export function ShareButton({ title, ...props }: ShareButtonProps) {
  const { isCopied, markCopied } = useCopied();

  async function handleShare() {
    if (await sharePage(title, globalThis.location.href)) markCopied();
  }

  return (
    <Button
      onPress={() => {
        void handleShare();
      }}
      {...props}
    >
      <Icon icon={IconShareOs} />
      <span aria-live="polite">{isCopied ? "Link copied" : "Share"}</span>
    </Button>
  );
}
