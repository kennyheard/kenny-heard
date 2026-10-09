import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Container } from "@/components/container";
import { Link } from "@/components/link";
import { Navigation } from "@/components/navigation";
import { isDefined } from "@/lib/utils";
import type { SanitySocialLink } from "@/sanity/schemas/documents/globals/navigation";
import type { SanityNavigationMenu } from "@/sanity/schemas/types/navigation-menu";
import type { SanityKeyedArray } from "@/sanity/types";
import type { Nullable } from "@/types";

export type FooterProps = Omit<ComponentProps<"footer">, "children"> &
  VariantProps<typeof variants> & {
    menu?: Nullable<SanityNavigationMenu>;
    social?: Nullable<SanityKeyedArray<SanitySocialLink>>;
  };

export const variants = tv({
  base: "px-6 py-6 md:px-8 md:py-8",
});

export function Footer({ menu, social, className, ...props }: FooterProps) {
  return (
    <footer id="footer" className={variants({ className })} {...props}>
      <Container>
        <div className="flex flex-wrap gap-x-8">
          <Navigation menu={menu} />
          {isDefined(social) && social.map(({ _key, link }) => <Link key={_key} link={link} />)}
        </div>
      </Container>
    </footer>
  );
}
