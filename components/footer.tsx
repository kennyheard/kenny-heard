import { stegaClean } from "next-sanity";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Container } from "@/components/container";
import { Icon } from "@/components/icon";
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
  base: "pt-16 md:pt-24",
});

export function Footer({ menu, social, className, ...props }: FooterProps) {
  return (
    <footer className={variants({ className })} {...props}>
      <Container className="border-rule gap-8 border-t pt-6 md:flex-row md:items-center md:justify-between">
        <Navigation menu={menu} />
        {isDefined(social) && (
          <div className="flex gap-6">
            {social.map(({ _key, link, icon }) => (
              <Link key={_key} to={link} aria-label={stegaClean(link?.label)} as="button" theme="icon">
                <Icon value={icon} />
              </Link>
            ))}
          </div>
        )}
      </Container>
    </footer>
  );
}
