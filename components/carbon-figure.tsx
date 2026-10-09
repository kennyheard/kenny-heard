"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { getCarbonGrade, gramsPerByte } from "@/lib/carbon";
import type { CarbonGrade } from "@/lib/carbon";
import { isDefined } from "@/lib/utils";

export type CarbonFigureProps = Omit<ComponentProps<"span">, "children"> & Omit<VariantProps<typeof variants>, "grade">;

/** How long, in milliseconds, nothing new must load before the figure counts as settled. */
const settleDelay = 500;

export const variants = tv({
  base: "font-meta",
  variants: {
    grade: {
      "A+": "text-emerald-600 dark:text-emerald-400",
      A: "text-green-600 dark:text-green-400",
      B: "text-lime-600 dark:text-lime-400",
      C: "text-yellow-600 dark:text-yellow-400",
      D: "text-amber-600 dark:text-amber-400",
      E: "text-orange-600 dark:text-orange-400",
      F: "text-red-600 dark:text-red-400",
    } satisfies Record<CarbonGrade, string>,
  },
});

/**
 * Adds up the bytes the browser has transferred since a moment in the visit.
 *
 * @param since - Time in the visit to count from, in milliseconds.
 * @returns The bytes transferred.
 */
function getTransferredBytes(since: number) {
  return performance
    .getEntries()
    .filter((entry): entry is PerformanceResourceTiming => entry instanceof PerformanceResourceTiming)
    .filter((entry) => entry.startTime >= since)
    .reduce((total, entry) => total + entry.transferSize, 0);
}

export function CarbonFigure({ className, ...props }: CarbonFigureProps) {
  const pathname = usePathname();
  const viewRef = useRef<{ pathname: string; start: number }>(undefined);
  const [grams, setGrams] = useState<number>();

  useEffect(() => {
    // The first view counts from the start of the visit, and each navigation after it from zero.
    if (viewRef.current?.pathname !== pathname) {
      viewRef.current = { pathname, start: isDefined(viewRef.current) ? performance.now() : 0 };
    }

    const { start } = viewRef.current;
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

    function handleResources() {
      if (document.readyState !== "complete") return;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setGrams(getTransferredBytes(start) * gramsPerByte);
      }, settleDelay);
    }

    handleResources();
    window.addEventListener("load", handleResources);
    const observer = new PerformanceObserver(handleResources);
    observer.observe({ type: "resource" });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("load", handleResources);
      observer.disconnect();
    };
  }, [pathname]);

  if (!isDefined(grams)) return null;

  const isBelowPrecision = grams < 0.0005;
  const grade = getCarbonGrade(grams);

  return (
    <span className={variants({ grade, className })} {...props}>
      {isBelowPrecision && (
        <>
          <span aria-hidden="true">&lt;</span>
          <span className="sr-only">less than </span>
        </>
      )}
      {isBelowPrecision ? "0.001" : grams.toFixed(3)}g
      <span className="sr-only"> of carbon dioxide for this page, rated {grade}</span>
    </span>
  );
}
