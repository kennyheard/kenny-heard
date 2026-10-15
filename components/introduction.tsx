import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Section } from "@/components/section";
import type { SectionProps } from "@/components/section";
import { isDefined } from "@/lib/utils";

export type IntroductionProps = Omit<SectionProps, "type" | "title"> &
  VariantProps<typeof variants> & {
    title: string;
  };

export const variants = tv({});

export function Introduction({ title, className, children, ...props }: IntroductionProps) {
  return (
    <Section type="introduction" className={variants({ className })} {...props}>
      <h1 className="sr-only">{title}</h1>
      {isDefined(children) && <p className="font-intro text-muted max-w-110 text-pretty">{children}</p>}
    </Section>
  );
}
