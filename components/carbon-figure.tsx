"use client";

import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { getGrams } from "@/config/carbon";
import { usePageBytes } from "@/hooks/use-page-bytes";
import { getCarbonGrade } from "@/lib/carbon";
import type { CarbonGrade } from "@/lib/carbon";
import { isDefined } from "@/lib/utils";

export type CarbonFigureProps = Omit<ComponentProps<"span">, "children"> & Omit<VariantProps<typeof variants>, "grade">;

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

export function CarbonFigure({ className, ...props }: CarbonFigureProps) {
  const bytes = usePageBytes();

  if (!isDefined(bytes)) return null;

  const grams = getGrams(bytes);
  const grade = getCarbonGrade(grams);

  return (
    <span className={variants({ grade, className })} {...props}>
      {grams.toFixed(3)}g<span className="sr-only"> of carbon dioxide for this page, rated {grade}</span>
    </span>
  );
}
