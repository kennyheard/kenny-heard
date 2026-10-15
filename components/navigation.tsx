import { stegaClean } from "next-sanity";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Link } from "@/components/link";
import { isDefined } from "@/lib/utils";
import type { SanityNavigationMenu } from "@/sanity/schemas/types/navigation-menu";
import type { Nullable } from "@/types";

export type NavigationProps = Omit<ComponentProps<"nav">, "children"> &
  VariantProps<typeof variants> & {
    menu?: Nullable<SanityNavigationMenu>;
    pathname?: string;
  };

export const variants = tv({
  base: "font-link flex flex-wrap items-center gap-x-6 gap-y-3",
});

export function Navigation({ menu, pathname, className, ...props }: NavigationProps) {
  const { links, name } = menu ?? {};

  if (!isDefined(links)) return null;

  return (
    <nav aria-label={stegaClean(name)} className={variants({ className })} {...props}>
      {links.map((link) => (
        <Link key={link._key} to={link} pathname={pathname} intent="standalone" tone="muted" />
      ))}
    </nav>
  );
}
