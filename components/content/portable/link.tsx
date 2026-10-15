import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Link } from "@/components/link";
import type { LinkProps } from "@/components/link";
import { isDefined } from "@/lib/utils";

export type PortableLinkProps = Omit<LinkProps, "to" | "as" | "theme"> &
  VariantProps<typeof variants> & {
    value?: SanityLink;
  };

export const variants = tv({});

export function PortableLink({ value: link, className, children, ...props }: PortableLinkProps) {
  if (!isDefined(link)) return <>{children}</>;

  return (
    <Link to={link} intent="inline" className={variants({ className })} {...props}>
      {children}
    </Link>
  );
}
