import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Container } from "@/components/container";
import { PortableText } from "@/components/content/portable-text";
import { Link } from "@/components/link";
import { site } from "@/config/metadata";
import { isDefined } from "@/lib/utils";
import type { SanityMinimalPortableText } from "@/sanity/schemas/types/minimal-portable-text";
import type { Nullable } from "@/types";

export type HeaderProps = Omit<ComponentProps<"header">, "children" | "role"> &
  VariantProps<typeof variants> & {
    name?: Nullable<string>;
    role?: Nullable<SanityMinimalPortableText>;
  };

export const variants = tv({
  base: "px-6 py-6 md:px-8 md:py-8",
});

export function Header({ name, role, className, ...props }: HeaderProps) {
  return (
    <header id="header" className={variants({ className })} {...props}>
      <Container>
        <div className="flex flex-col gap-1">
          <Link href="/" intent="none" className="font-h3">
            {name ?? site.name}
          </Link>
          {isDefined(role) && <PortableText value={role} />}
        </div>
      </Container>
    </header>
  );
}
