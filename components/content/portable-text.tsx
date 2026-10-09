import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { PortableText as PortableTextReact } from "@portabletext/react";
import type {
  PortableTextComponents,
  PortableTextMarkComponentProps,
  PortableTextTypeComponentProps,
} from "@portabletext/react";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { PortableImage } from "@/components/content/portable/image";
import { PortableLink } from "@/components/content/portable/link";
import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";
import type { SanityExtendedPortableText } from "@/sanity/schemas/types/extended-portable-text";
import type { SanityMinimalPortableText } from "@/sanity/schemas/types/minimal-portable-text";
import type { SanityStandardPortableText } from "@/sanity/schemas/types/standard-portable-text";

export type PortableTextProps = ComponentProps<"div"> &
  VariantProps<typeof variants> & {
    value: SanityMinimalPortableText | SanityStandardPortableText | SanityExtendedPortableText;
  };

export const variants = tv({
  base: "prose max-w-none",
});

/**
 * Components for each block style, mark, and embedded type in rich text, rendering unknown types as nothing and unknown
 * marks as plain text.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    h5: ({ children }) => <h5>{children}</h5>,
    h6: ({ children }) => <h6>{children}</h6>,
  },
  marks: {
    linkMark: ({ value, children }: PortableTextMarkComponentProps<SanityLink>) => (
      <PortableLink value={value}>{children}</PortableLink>
    ),
  },
  types: {
    accessibleImage: (type: PortableTextTypeComponentProps<SanityAccessibleImage>) => (
      <PortableImage value={type.value} />
    ),
  },
  unknownType: () => null,
  unknownMark: ({ children }) => <>{children}</>,
};

export function PortableText({ value, className, ...props }: PortableTextProps) {
  return (
    <div className={variants({ className })} {...props}>
      <PortableTextReact value={value} components={components} />
    </div>
  );
}
