import { getImageDimensions } from "@sanity/asset-utils";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { ImageUrlBuilderOptions } from "@sanity/image-url";
import type { ImageLoader, ImageProps } from "next/image";

import { isDefined, isExpandedReference } from "@/lib/utils";
import { dataset, projectId } from "@/sanity/lib/api";
import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";
import type { SanityAnyImage } from "@/sanity/types";
import type { Nullable } from "@/types";

/** How images are processed and sized for one context. */
export interface ImageProfileDefinition {
  /** Format, quality, and dimensions requested from the image CDN. */
  options: ImageUrlBuilderOptions;
  /** Value for the image's `sizes` attribute. */
  sizes: string;
}

/** Props for the Next.js `Image` component, resolved from a Sanity image or a static source. */
interface ResolvedImage {
  /** Image URL or static import. */
  src: ImageProps["src"];
  /** Loader that requests each responsive width from the image CDN, or undefined for a static source. */
  loader?: ImageLoader;
  /** Text shown below the image. */
  caption?: string;
  /** Alternative text. */
  alt?: string;
  /** Intrinsic width in pixels. */
  width?: ImageProps["width"];
  /** Intrinsic height in pixels. */
  height?: ImageProps["height"];
  /** Base64 placeholder shown while the image loads. */
  blurDataUrl?: string;
  /** `object-position` value that keeps the author's hotspot in view when the image is cropped. */
  objectPosition?: string;
}

/** Image profiles keyed by name. */
export type ImageConfig<T extends string> = Record<T, ImageProfileDefinition>;

/** URL builder for the configured dataset, shared because the loader builds a URL for every width. */
const imageUrlBuilder = createImageUrlBuilder({ projectId, dataset });

/**
 * Builds an image CDN URL for a Sanity image.
 *
 * @param image - The image.
 * @param options - Format, quality, and dimensions to request.
 * @returns The image URL.
 */
export function buildImageUrl(image: SanityAnyImage, options?: ImageUrlBuilderOptions) {
  return imageUrlBuilder
    .image(image)
    .withOptions(options ?? {})
    .url();
}

/**
 * Works out the dimensions of the image the CDN will deliver, from the requested size when it sets both
 * dimensions and from the author's crop otherwise.
 *
 * @param image - The image.
 * @param src - The image URL, which encodes the source dimensions.
 * @param options - The options the URL was built with.
 * @returns The width, height, and aspect ratio.
 */
function resolveDimensions(image: SanityAnyImage, src: string, options: ImageUrlBuilderOptions) {
  const { width: pinnedWidth, height: pinnedHeight } = options;

  if (isDefined(pinnedWidth) && isDefined(pinnedHeight)) {
    return { width: pinnedWidth, height: pinnedHeight, aspectRatio: pinnedWidth / pinnedHeight };
  }

  const { width: sourceWidth, height: sourceHeight } = getImageDimensions(src);
  const { left = 0, bottom = 0, right = 0, top = 0 } = image.crop ?? {};

  const width = Math.round(sourceWidth * (1 - left - right));
  const height = Math.round(sourceHeight * (1 - top - bottom));

  return { width, height, aspectRatio: width / height };
}

/**
 * Fills in whichever of width and height is missing so the pair matches the image's aspect ratio.
 *
 * @param aspectRatio - The aspect ratio of the delivered image.
 * @param width - The requested width.
 * @param height - The requested height.
 * @returns The width and height, or undefined when neither was requested.
 */
function constrainDimensions(aspectRatio: number, width: ImageProps["width"], height: ImageProps["height"]) {
  const requestedWidth = Number(width);
  const requestedHeight = Number(height);
  const hasWidth = Number.isFinite(requestedWidth);
  const hasHeight = Number.isFinite(requestedHeight);
  const hasAspectRatio = Number.isFinite(aspectRatio) && aspectRatio > 0;

  if (hasWidth && hasHeight) return { width: requestedWidth, height: requestedHeight };
  if (hasWidth && hasAspectRatio) return { width: requestedWidth, height: Math.round(requestedWidth / aspectRatio) };
  if (hasHeight && hasAspectRatio) return { width: Math.round(requestedHeight * aspectRatio), height: requestedHeight };

  return undefined;
}

/**
 * Creates a loader that requests each responsive width from the image CDN rather than the Next.js
 * optimiser. When the options set both dimensions, the height scales with each width.
 *
 * @param image - The image.
 * @param options - The profile's options.
 * @returns A loader that returns a URL for a given width.
 */
function createImageLoader(image: SanityAnyImage, options: ImageUrlBuilderOptions): ImageLoader {
  const { width: pinnedWidth, height: pinnedHeight } = options;
  const pinnedAspectRatio = isDefined(pinnedWidth) && isDefined(pinnedHeight) ? pinnedWidth / pinnedHeight : undefined;

  return ({ width }) => {
    if (!isDefined(pinnedAspectRatio)) return buildImageUrl(image, { fit: "max", ...options, width });

    return buildImageUrl(image, { ...options, width, height: Math.round(width / pinnedAspectRatio) });
  };
}

/**
 * Creates image helpers bound to a set of profiles.
 *
 * @param imageConfig - The profiles, keyed by name.
 * @returns The profiles and a resolver that applies them.
 */
export function defineImageConfig<T extends string>(imageConfig: ImageConfig<T>) {
  type ImageProfile = T;

  /** Image to resolve, from Sanity or a static source. */
  interface ResolveImageProps {
    /** Sanity image, which takes precedence over a static source. */
    image: Nullable<SanityAnyImage>;
    /** Static source, used when there is no Sanity image. */
    src?: ImageProps["src"];
    /** Width to render at. */
    width?: ImageProps["width"];
    /** Height to render at. */
    height?: ImageProps["height"];
    /** Profile to process a Sanity image with. */
    profile: ImageProfile;
  }

  /** Image profiles keyed by name. */
  const imageProfiles = imageConfig;

  /**
   * Resolves a Sanity image into props for the Next.js `Image` component.
   *
   * @param image - The image.
   * @param profile - The profile to process it with.
   * @returns The image props, with the aspect ratio of the delivered image.
   */
  function resolveSanityImage(image: SanityAnyImage, profile: ImageProfile) {
    const { options } = imageProfiles[profile];
    const src = buildImageUrl(image, options);
    const loader = createImageLoader(image, options);

    const { caption, alt }: Partial<SanityAccessibleImage> = image._type === "accessibleImage" ? image : {};
    const { width, height, aspectRatio } = resolveDimensions(image, src, options);
    const { asset, hotspot } = image;
    const blurDataUrl = isExpandedReference(asset) ? asset.metadata?.lqip : undefined;
    const objectPosition = isDefined(hotspot) ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : undefined;

    return { src, loader, caption, alt, width, height, aspectRatio, blurDataUrl, objectPosition };
  }

  /**
   * Resolves a Sanity image or a static source into props for the Next.js `Image` component.
   *
   * @returns The image props, or undefined when there is no image.
   */
  function resolveImage({ image, src, width, height, profile }: ResolveImageProps): ResolvedImage | undefined {
    if (isDefined(image?.asset)) {
      const { aspectRatio, ...resolvedImage } = resolveSanityImage(image, profile);

      return { ...resolvedImage, ...constrainDimensions(aspectRatio, width, height) };
    }

    if (isDefined(src)) return { src, width, height };

    return undefined;
  }

  return { imageProfiles, resolveImage };
}
