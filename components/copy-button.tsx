"use client";

import { IconCircleCheck, IconSquareBehindSquare1 } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { useState } from "react";

import { Button } from "@/components/button";
import type { ButtonProps } from "@/components/button";
import { Icon } from "@/components/icon";

export type CopyButtonProps = Omit<ButtonProps, "children" | "onPress"> & {
  text: string;
};

/** How long the button shows that it copied, in milliseconds. */
const copiedDuration = 2000;

export function CopyButton({ text, ...props }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, copiedDuration);
  }

  return (
    <Button
      theme="compact"
      onPress={() => {
        void copyText();
      }}
      {...props}
    >
      <Icon icon={isCopied ? IconCircleCheck : IconSquareBehindSquare1} size="1rem" tone="inherit" />
      <span aria-live="polite">{isCopied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
