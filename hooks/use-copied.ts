import { useEffect, useRef, useState } from "react";

/** How long something shows that it copied, in milliseconds. */
const copiedDuration = 2000;

/**
 * Tracks whether something has just been copied, resetting after a moment and restarting the moment on each copy.
 *
 * @returns Whether it has just copied, and a function to call when it copies.
 */
export function useCopied() {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
    },
    [],
  );

  function markCopied() {
    clearTimeout(timeoutRef.current);
    setIsCopied(true);
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, copiedDuration);
  }

  return { isCopied, markCopied };
}
