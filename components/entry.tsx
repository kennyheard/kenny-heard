import type { ComponentProps } from "react";
import { cn, tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Icon } from "@/components/icon";
import type { IconProps } from "@/components/icon";
import { Link } from "@/components/link";
import type { LinkDestination } from "@/lib/links";
import { formatReadingTime } from "@/lib/portable-text";
import { isDefined } from "@/lib/utils";
import type { Nullable } from "@/types";

export type EntryProps = Omit<ComponentProps<"div">, "children"> &
  VariantProps<typeof variants> & {
    entry: {
      icon?: IconProps["value"];
      title?: Nullable<string>;
      description?: Nullable<string>;
      link?: LinkDestination;
      readingMinutes?: number;
      isComingSoon?: boolean;
    };
  };

export const variants = tv({
  base: "flex flex-col gap-2",
});

export function Entry({ entry, className, ...props }: EntryProps) {
  const { icon, title, description, link, readingMinutes, isComingSoon = false } = entry;

  return (
    <div className={variants({ className })} {...props}>
      <h3 className={cn("font-title text-balance", isComingSoon ? "text-muted" : "text-foreground")}>
        {isDefined(icon) && <Icon value={icon} tone="muted" inline className="mr-2" />}
        <Link to={link} intent="standalone">
          {title}
        </Link>
        {isComingSoon && (
          <span className="font-meta text-muted ml-2">
            <span aria-hidden="true">Soon</span>
            <span className="sr-only"> (coming soon)</span>
          </span>
        )}
      </h3>
      {isDefined(description) && <p className="font-description text-muted text-pretty">{description}</p>}
      {isDefined(readingMinutes) && <p className="font-meta text-muted">{formatReadingTime(readingMinutes)}</p>}
    </div>
  );
}
