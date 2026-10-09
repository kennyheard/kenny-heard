import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Container } from "@/components/container";
import { PortableText } from "@/components/content/portable-text";
import { Link } from "@/components/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/config/metadata";
import { isDefined } from "@/lib/utils";
import type { SanityMinimalPortableText } from "@/sanity/schemas/types/minimal-portable-text";
import type { Nullable } from "@/types";

export type HeaderProps = Omit<ComponentProps<"header">, "children" | "role"> &
  VariantProps<typeof variants> & {
    name?: Nullable<string>;
    role?: Nullable<SanityMinimalPortableText>;
  };

export const variants = tv({});

export function Header({ name, role, className, ...props }: HeaderProps) {
  return (
    <header className={variants({ className })} {...props}>
      <Container className="flex-row items-start justify-between gap-6">
        <div className="font-title flex flex-col gap-1">
          <Link href="/" intent="none" className="text-foreground w-fit">
            {name ?? site.name}
          </Link>
          {isDefined(role) && <PortableText value={role} type="role" />}
        </div>
        <ThemeToggle />
      </Container>
    </header>
  );
}
