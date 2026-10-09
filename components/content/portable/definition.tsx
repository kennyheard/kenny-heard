import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { isDefined } from "@/lib/utils";
import type { SanityDefinition } from "@/sanity/schemas/blocks/definition";

export type PortableDefinitionProps = Omit<ComponentProps<"dl">, "children"> &
  VariantProps<typeof variants> & {
    value: SanityDefinition;
  };

export const variants = tv({
  base: "flex flex-col gap-4 md:my-6",
});

export function PortableDefinition({ value, className, ...props }: PortableDefinitionProps) {
  const { term, pronunciation, wordClass, sense, origin } = value;

  return (
    <dl className={variants({ className })} {...props}>
      <dt className="flex flex-col gap-2">
        <dfn className="font-term text-balance not-italic">{term}</dfn>
        {isDefined([pronunciation, wordClass]) && (
          <span className="font-title text-muted flex flex-wrap gap-3">
            {isDefined(pronunciation) && <span>{pronunciation}</span>}
            {isDefined(wordClass) && <span className="italic">{wordClass}</span>}
          </span>
        )}
      </dt>
      {isDefined(sense) && <dd className="font-serif text-lg/relaxed text-pretty italic">{sense}</dd>}
      {isDefined(origin) && <dd className="font-meta text-muted">{origin}</dd>}
    </dl>
  );
}
