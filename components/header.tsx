import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Container } from "@/components/container";
import { Link } from "@/components/link";
import { Navigation } from "@/components/navigation";
import { site } from "@/config/metadata";
import type { SanityNavigationMenu } from "@/sanity/schemas/types/navigation-menu";
import type { Nullable } from "@/types";

export type HeaderProps = Omit<ComponentProps<"header">, "children"> &
  VariantProps<typeof variants> & {
    menu?: Nullable<SanityNavigationMenu>;
  };

export const variants = tv({
  base: "px-6 py-6 md:px-8 md:py-8",
});

export function Header({ menu, className, ...props }: HeaderProps) {
  return (
    <header id="header" className={variants({ className })} {...props}>
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" intent="none" className="font-h3">
            {site.name}
          </Link>
          <Navigation menu={menu} />
        </div>
      </Container>
    </header>
  );
}
