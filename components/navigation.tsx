"use client";

import { stegaClean } from "next-sanity";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
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
  };

type StaticNavigationProps = NavigationProps & {
  pathname?: string;
};

export const variants = tv({
  base: "font-link flex flex-wrap items-center gap-x-6 gap-y-3",
});

export function Navigation(props: NavigationProps) {
  return (
    <Suspense fallback={<StaticNavigation {...props} />}>
      <DynamicNavigation {...props} />
    </Suspense>
  );
}

function DynamicNavigation(props: NavigationProps) {
  const pathname = usePathname();

  return <StaticNavigation pathname={pathname} {...props} />;
}

function StaticNavigation({ menu, pathname, className, ...props }: StaticNavigationProps) {
  const { links, name } = menu ?? {};

  if (!isDefined(links)) return null;

  return (
    <nav className={variants({ className })} aria-label={stegaClean(name)} {...props}>
      {links.map((link) => (
        <Link key={link._key} link={link} pathname={pathname} intent="standalone" tone="muted" />
      ))}
    </nav>
  );
}
