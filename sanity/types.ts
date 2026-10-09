import type { File, FileAsset, Image, ImageAsset, ImageMetadata, KeyedSegment, Reference } from "sanity";

import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";
import type { Strict } from "@/types";

/** Array whose items carry the `_key` Sanity gives array members. */
export type SanityKeyedArray<T> = (KeyedSegment & T)[];

/** Reference to a document, or the document itself once a query expands it. */
export type SanityReference<T> = Reference | T;

/** File asset as queries expand it, with only its address. */
export type SanityFileAsset = Pick<FileAsset, "url">;

/** Image asset as queries expand it, with its id, which encodes its dimensions, and any blurred placeholder. */
export type SanityImageAsset = Pick<ImageAsset, "_id"> & { metadata?: Pick<ImageMetadata, "lqip"> };

/** File field whose asset reference may be expanded. */
export type SanityFile = Strict<{
  [K in keyof File]: K extends "asset" ? SanityReference<SanityFileAsset> : File[K];
}> & { _type: "file" };

/** Image field whose asset reference may be expanded. */
export type SanityImage = Strict<{
  [K in keyof Image]: K extends "asset" ? SanityReference<SanityImageAsset> : Image[K];
}> & { _type: "image" };

/** Plain or accessible image. */
export type SanityAnyImage = SanityImage | SanityAccessibleImage;
