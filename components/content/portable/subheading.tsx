import { IconChainLink1 } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Icon } from "@/components/icon";
import { Link } from "@/components/link";

export type PortableSubheadingProps = ComponentProps<"h2"> &
  VariantProps<typeof variants> & {
    id: string;
  };

export const variants = tv({
  base: "group font-subheading mt-6 -mb-2 scroll-mt-8 text-balance",
});

export function PortableSubheading({ id, className, children, ...props }: PortableSubheadingProps) {
  return (
    <h2 id={id} className={variants({ className })} {...props}>
      {children}
      <Link
        href={`#${id}`}
        intent="none"
        aria-label="Link to this section"
        className="group-hocus:opacity-100 ml-2 inline-flex align-middle opacity-0"
      >
        <Icon icon={IconChainLink1} size="0.75rem" tone="inherit" />
      </Link>
    </h2>
  );
}
