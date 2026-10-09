"use client";

import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Link } from "@/components/link";
import type { LinkProps } from "@/components/link";
import { isDefined } from "@/lib/utils";

export type PortableLinkProps = Omit<LinkProps, "link" | "route" | "href"> &
  VariantProps<typeof variants> & {
    value?: SanityLink;
  };

export const variants = tv({});

export function PortableLink({ value: link, className, children, ...props }: PortableLinkProps) {
  if (!isDefined(link)) return typeof children === "function" ? null : <>{children}</>;

  return (
    <Link
      link={link}
      intent="inline"
      className={composeRenderProps(className, (composedClassName) => variants({ className: composedClassName }))}
      {...props}
    >
      {children}
    </Link>
  );
}
