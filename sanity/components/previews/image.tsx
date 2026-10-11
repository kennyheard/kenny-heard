"use client";

import { getImageDimensions } from "@sanity/asset-utils";
import { Card, Stack, Text } from "@sanity/ui";
import Image from "next/image";

import { buildImageUrl } from "@/lib/images";
import { isDefined } from "@/lib/utils";
import { BlockPreviewFrame } from "@/sanity/components/previews/frame";
import { createBlockPreview, isBlockOf } from "@/sanity/lib/blocks";
import type { SanityAccessibleImage } from "@/sanity/schemas/types/accessible-image";

export interface ImagePreviewProps {
  value: SanityAccessibleImage;
}

export function ImagePreview({ value }: ImagePreviewProps) {
  const { asset, caption, alt } = value;
  const url = isDefined(asset) ? buildImageUrl(value, { width: 960 }) : undefined;
  const dimensions = isDefined(asset) ? getImageDimensions(asset) : undefined;

  return (
    <BlockPreviewFrame label="Image">
      {isDefined(url) && isDefined(dimensions) && (
        <Card radius={3} overflow="hidden">
          <Image
            src={url}
            alt={alt ?? ""}
            width={dimensions.width}
            height={dimensions.height}
            unoptimized
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </Card>
      )}
      <Stack gap={3}>
        {isDefined(caption) && (
          <Text size={1} style={{ fontStyle: "italic" }}>
            {caption}
          </Text>
        )}
        <Text size={1} muted>
          {isDefined(alt) ? `Alternative text: ${alt}` : "No alternative text yet"}
        </Text>
      </Stack>
    </BlockPreviewFrame>
  );
}

/** Preview of an image block, showing the image with its caption and alternative text. */
export const ImageBlockPreview = createBlockPreview(isBlockOf<SanityAccessibleImage>("accessibleImage"), ImagePreview);
