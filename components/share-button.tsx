"use client";

import { IconShareOs } from "@central-icons-react/round-outlined-radius-2-stroke-1";

import { Button } from "@/components/button";
import type { ButtonProps } from "@/components/button";
import { Icon } from "@/components/icon";
import { useCopied } from "@/hooks/use-copied";
import { sharePage } from "@/lib/share";

export type ShareButtonProps = Omit<ButtonProps, "children" | "onClick"> & {
  title: string;
};

export function ShareButton({ title, ...props }: ShareButtonProps) {
  const { isCopied, markCopied } = useCopied();

  async function handleShare() {
    if (await sharePage(title, globalThis.location.href)) markCopied();
  }

  return (
    <Button
      onClick={() => {
        void handleShare();
      }}
      {...props}
    >
      <Icon value={IconShareOs} />
      <span aria-live="polite">{isCopied ? "Link copied" : "Share"}</span>
    </Button>
  );
}
