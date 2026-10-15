"use client";

import { IconCircleCheck, IconSquareBehindSquare1 } from "@central-icons-react/round-outlined-radius-2-stroke-1";

import { Button } from "@/components/button";
import type { ButtonProps } from "@/components/button";
import { Icon } from "@/components/icon";
import { useCopied } from "@/hooks/use-copied";
import { copyText } from "@/lib/clipboard";

export type CopyButtonProps = Omit<ButtonProps, "children" | "onClick"> & {
  text: string;
};

export function CopyButton({ text, ...props }: CopyButtonProps) {
  const { isCopied, markCopied } = useCopied();

  async function handleCopy() {
    if (await copyText(text)) markCopied();
  }

  return (
    <Button
      onClick={() => {
        void handleCopy();
      }}
      theme="compact"
      {...props}
    >
      <Icon value={isCopied ? IconCircleCheck : IconSquareBehindSquare1} />
      <span aria-live="polite">{isCopied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
