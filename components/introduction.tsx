import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Container } from "@/components/container";
import { Section } from "@/components/section";
import type { SectionProps } from "@/components/section";

export type IntroductionProps = Omit<SectionProps, "type"> & VariantProps<typeof variants>;

export const variants = tv({});

export function Introduction({ className, children, ...props }: IntroductionProps) {
  return (
    <Section type="introduction" className={variants({ className })} {...props}>
      <Container>
        <p className="font-intro text-muted max-w-110 text-pretty">{children}</p>
      </Container>
    </Section>
  );
}
