import { stegaClean } from "next-sanity";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { CopyButton } from "@/components/copy-button";
import { highlightCode } from "@/lib/code";
import { isDefined } from "@/lib/utils";
import type { SanityCode } from "@/sanity/schemas/blocks/code";

export type PortableCodeProps = Omit<ComponentProps<"figure">, "children"> &
  VariantProps<typeof variants> & {
    value: SanityCode;
  };

export const variants = tv({
  base: "border-hairline overflow-hidden rounded-md border md:my-6",
});

export async function PortableCode({ value, className, ...props }: PortableCodeProps) {
  const { filename, language, code = "" } = value;
  const lines = await highlightCode(code, language);

  return (
    <figure className={variants({ className })} {...props}>
      <div className="border-hairline flex items-center gap-4 border-b px-4 py-3">
        {isDefined(filename) && <figcaption className="font-meta text-muted">{filename}</figcaption>}
        <CopyButton text={stegaClean(code)} className="ml-auto" />
      </div>
      <pre translate="no" className="text-code overflow-x-auto p-4 font-mono text-sm/6 font-medium">
        <code>
          {lines.map(({ key, tokens }) => (
            <span key={key} className="block min-h-lh">
              {tokens.map(({ key: tokenKey, content, className: tokenClassName }) => (
                <span key={tokenKey} className={tokenClassName}>
                  {content}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
