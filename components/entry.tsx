import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import type { ComponentProps } from "react";
import { cn, tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Icon } from "@/components/icon";
import type { IconProps } from "@/components/icon";
import { Link } from "@/components/link";
import { isDefined } from "@/lib/utils";
import type { Nullable } from "@/types";

export type EntryProps = Omit<ComponentProps<"div">, "children" | "title"> &
  VariantProps<typeof variants> & {
    icon?: IconProps["icon"];
    title: Nullable<string>;
    description?: Nullable<string>;
    link?: SanityLink;
    href?: string;
    readingTime?: string;
    isComingSoon?: boolean;
  };

export const variants = tv({
  base: "flex flex-col gap-2",
});

export function Entry({
  icon,
  title,
  description,
  link,
  href,
  readingTime,
  isComingSoon = false,
  className,
  ...props
}: EntryProps) {
  const isLinked = isDefined(link) || isDefined(href);

  return (
    <div className={variants({ className })} {...props}>
      <h3 className={cn("font-title text-balance", isComingSoon ? "text-muted" : "text-foreground")}>
        {isDefined(icon) && <Icon icon={icon} tone="muted" inline className="mr-2" />}
        {isLinked ? (
          <Link {...(isDefined(link) ? { link } : { href })} intent="standalone">
            {title}
          </Link>
        ) : (
          title
        )}
        {isComingSoon && (
          <span className="font-meta text-muted ml-2">
            <span className="sr-only">Coming </span>Soon
          </span>
        )}
      </h3>
      {isDefined(description) && <p className="font-description text-muted text-pretty">{description}</p>}
      {isDefined(readingTime) && <p className="font-meta text-muted">{readingTime}</p>}
    </div>
  );
}
