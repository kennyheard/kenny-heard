import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { PortableText as PortableTextReact, toPlainText } from "@portabletext/react";
import type {
  PortableTextComponents,
  PortableTextMarkComponentProps,
  PortableTextTypeComponentProps,
} from "@portabletext/react";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { PortableCode } from "@/components/content/portable/code";
import { PortableDefinition } from "@/components/content/portable/definition";
import { PortableImage } from "@/components/content/portable/image";
import { PortableLink } from "@/components/content/portable/link";
import { PortableQuotation } from "@/components/content/portable/quotation";
import { PortableSubheading } from "@/components/content/portable/subheading";
import { Link } from "@/components/link";
import { getAnchorId } from "@/lib/portable-text";
import type { SanityCode } from "@/sanity/schemas/blocks/code";
import type { SanityDefinition } from "@/sanity/schemas/blocks/definition";
import type { SanityQuotation } from "@/sanity/schemas/blocks/quotation";
import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";
import type { SanityExtendedPortableText } from "@/sanity/schemas/types/extended-portable-text";
import type { SanityMinimalPortableText } from "@/sanity/schemas/types/minimal-portable-text";
import type { SanityStandardPortableText } from "@/sanity/schemas/types/standard-portable-text";

export type PortableTextProps = ComponentProps<"div"> &
  VariantProps<typeof variants> & {
    value: SanityMinimalPortableText | SanityStandardPortableText | SanityExtendedPortableText;
  };

export const variants = tv({
  base: "flex flex-col text-pretty",
  variants: {
    type: {
      body: "font-body text-foreground gap-8",
      note: "text-muted gap-6 font-serif text-base/relaxed italic",
      profession: "text-muted italic",
    },
  },
  defaultVariants: {
    type: "body",
  },
});

/**
 * Components for each block style, mark, and embedded type in rich text, rendering unknown types as nothing and unknown
 * marks as plain text.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    subheading: ({ value, children }) => (
      <PortableSubheading id={getAnchorId(toPlainText(value))}>{children}</PortableSubheading>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>,
    number: ({ children }) => <ol className="flex list-decimal flex-col gap-2 pl-5">{children}</ol>,
  },
  listItem: ({ children }) => <li className="pl-1">{children}</li>,
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    code: ({ children }) => <code className="font-mono text-sm">{children}</code>,
    linkMark: ({ value, children }: PortableTextMarkComponentProps<SanityLink>) => (
      <PortableLink value={value}>{children}</PortableLink>
    ),
  },
  types: {
    accessibleImage: (type: PortableTextTypeComponentProps<SanityAccessibleImage>) => (
      <PortableImage value={type.value} />
    ),
    quotation: (type: PortableTextTypeComponentProps<SanityQuotation>) => <PortableQuotation value={type.value} />,
    definition: (type: PortableTextTypeComponentProps<SanityDefinition>) => <PortableDefinition value={type.value} />,
    code: (type: PortableTextTypeComponentProps<SanityCode>) => <PortableCode value={type.value} />,
  },
  unknownType: () => null,
  unknownMark: ({ children }) => <>{children}</>,
};

/** Components for the profession under the name in the header, whose links only change colour on hover. */
const professionComponents: PortableTextComponents = {
  ...components,
  marks: {
    ...components.marks,
    linkMark: ({ value, children }: PortableTextMarkComponentProps<SanityLink>) => (
      <Link to={value} intent="none" tone="subtle">
        {children}
      </Link>
    ),
  },
};

export function PortableText({ value, type, className, ...props }: PortableTextProps) {
  return (
    <div className={variants({ type, className })} {...props}>
      <PortableTextReact value={value} components={type === "profession" ? professionComponents : components} />
    </div>
  );
}
