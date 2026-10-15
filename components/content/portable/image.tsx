import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { Image } from "@/components/image";
import type { ImageProps } from "@/components/image";
import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";

export type PortableImageProps = Omit<ImageProps, "image" | "src" | "profile" | "quality" | "children"> &
  VariantProps<typeof variants> & {
    value: SanityAccessibleImage;
  };

export const variants = tv({
  base: "md:my-6",
});

export function PortableImage({ value: image, className, ...props }: PortableImageProps) {
  return <Image image={image} profile="content" className={variants({ className })} {...props} />;
}
