import NextImage from "next/image";
import type { ImageProps as NextImageProps } from "next/image";
import { cn, tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { imageProfiles, resolveImage } from "@/config/images";
import type { ImageProfile } from "@/config/images";
import { isDefined } from "@/lib/utils";
import type { SanityAnyImage } from "@/sanity/types";
import type { Exclusive, Nullable } from "@/types";

export type ImageCommonProps = VariantProps<typeof variants> & {
  caption?: string;
  profile: ImageProfile;
};

export type ImageSanityProps = Omit<NextImageProps, "src" | "alt" | "quality"> & {
  image?: Nullable<SanityAnyImage>;
  alt?: string;
};

export type ImageProps = ImageCommonProps & Exclusive<ImageSanityProps, NextImageProps>;

export const variants = tv({
  base: "relative flex size-full flex-col items-center justify-center gap-3 overflow-hidden",
});

export function Image({ caption, profile, image, className, ...props }: ImageProps) {
  const { src, alt, width, height, fill, preload, style, ...forwardedProps } = props;
  const resolvedImage = resolveImage({ image, src, width, height, profile });

  const resolvedCaption = caption ?? resolvedImage?.caption;
  const resolvedAlt = alt ?? resolvedImage?.alt ?? "";

  if (!isDefined(resolvedImage)) {
    return <div className={variants({ className: cn("bg-rule", className) })} />;
  }

  return (
    <figure className={variants({ className })}>
      <NextImage
        src={resolvedImage.src}
        loader={resolvedImage.loader}
        alt={resolvedAlt}
        sizes={imageProfiles[profile].sizes}
        placeholder={isDefined(resolvedImage.blurDataUrl) ? "blur" : "empty"}
        blurDataURL={resolvedImage.blurDataUrl}
        fill={fill}
        preload={preload}
        fetchPriority={preload === true ? "high" : "auto"}
        className="outline-hairline max-w-content size-full rounded-md object-cover outline -outline-offset-1"
        style={{ objectPosition: resolvedImage.objectPosition, ...style }}
        {...(fill !== true && {
          width: resolvedImage.width,
          height: resolvedImage.height,
        })}
        {...forwardedProps}
      />
      {isDefined(resolvedCaption) && (
        <figcaption className="font-caption self-start text-balance">{resolvedCaption}</figcaption>
      )}
    </figure>
  );
}
