"use client";

import NextImage from "next/image";
import type { ImageProps as NextImageProps } from "next/image";
import { cn, tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { imageProfiles, resolveImage } from "@/config/images";
import type { ImageProfile } from "@/config/images";
import { isDefined } from "@/lib/utils";
import type { SanityAnyImage } from "@/sanity/types";
import type { Nullable } from "@/types";

export type ImageCommonProps = VariantProps<typeof variants> & {
  caption?: string;
  profile: ImageProfile;
};

export type ImageProps<T extends "image" | "src" = "image"> = T extends "image"
  ? ImageCommonProps &
      Omit<NextImageProps, "src" | "alt" | "quality"> & { image?: Nullable<SanityAnyImage>; src?: never; alt?: string }
  : ImageCommonProps & NextImageProps & { image?: never };

export const variants = tv({
  base: "relative flex size-full flex-col items-center justify-center overflow-hidden",
});

export function Image({ image, caption, profile, className, ...props }: ImageProps<"image" | "src">) {
  const { src, alt, width, height, fill, preload, style, ...forwardedProps } = props;
  const resolvedImage = resolveImage({ image, src, width, height, profile });

  const resolvedCaption = caption ?? resolvedImage?.caption;
  const resolvedAlt = alt ?? resolvedImage?.alt ?? "";

  if (!isDefined(resolvedImage)) {
    return <div className={variants({ className: cn("bg-neutral-200", className) })} />;
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
        className="size-full max-w-(--breakpoint-container) object-cover"
        style={{ objectPosition: resolvedImage.objectPosition, ...style }}
        {...(fill !== true && {
          width: resolvedImage.width,
          height: resolvedImage.height,
        })}
        {...forwardedProps}
      />
      {isDefined(resolvedCaption) && <figcaption className="mt-4 mr-auto ml-0 text-sm">{resolvedCaption}</figcaption>}
    </figure>
  );
}
