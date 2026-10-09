import { ImageIcon } from "lucide-react";
import type { ReactNode } from "react";
import { defineField, defineType } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import type { SanityImage } from "@/sanity/types";

export type SanityAccessibleImage = Omit<SanityImage, "_type"> & {
  _type: "accessibleImage";
  caption?: string;
  alt?: string;
};

export const accessibleImage = defineType({
  name: "accessibleImage" satisfies SanityAccessibleImage["_type"],
  type: "image",
  title: "Image",
  icon: createSanityIcon(ImageIcon),
  description: "Image with alternative text and an optional caption. Upload a PNG or JPEG.",
  preview: {
    select: {
      asset: "asset",
      caption: "caption",
      alt: "alt",
    },
    prepare(selection: { asset?: ReactNode; caption?: string; alt?: string }) {
      const { asset, caption, alt } = selection;

      return {
        title: alt ?? caption ?? "Image",
        media: asset ?? undefined,
      };
    },
  },
  options: {
    hotspot: true,
    accept: "image/png, image/jpeg",
  },
  fields: [
    defineField({
      name: "caption" satisfies keyof SanityAccessibleImage,
      type: "string",
      description: "Text shown below the image, such as a credit.",
    }),
    defineField({
      name: "alt" satisfies keyof SanityAccessibleImage,
      type: "string",
      title: "Alternative Text",
      description: "Description of the image for people who can't see it. Don't repeat the caption.",
      // Required because decorative images use a plain image field instead of this type.
      validation: (rule) => rule.required(),
    }),
  ],
});
