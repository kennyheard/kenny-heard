import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Container } from "@/components/container";
import { Link } from "@/components/link";
import { site } from "@/config/metadata";
import type { Nullable } from "@/types";

export type FooterProps = Omit<ComponentProps<"footer">, "children"> &
  VariantProps<typeof variants> & {
    attribution?: Nullable<string>;
  };

export const variants = tv({
  base: "px-6 py-6 md:px-8 md:py-8",
});

export function Footer({ attribution, className, ...props }: FooterProps) {
  return (
    <footer id="footer" className={variants({ className })} {...props}>
      <Container>
        <p className="flex flex-wrap gap-x-2 text-sm">
          {attribution ?? site.description}
          <Link href="https://cairn.driftime.com">cairn.driftime.com</Link>
        </p>
      </Container>
    </footer>
  );
}
