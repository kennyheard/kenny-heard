"use client";

import { Box, Stack, Text } from "@sanity/ui";

import { isDefined } from "@/lib/utils";
import { BlockPreviewFrame } from "@/sanity/components/previews/frame";
import { createBlockPreview, isBlockOf } from "@/sanity/lib/blocks";
import type { SanityQuotation } from "@/sanity/schemas/blocks/quotation";

export interface QuotationPreviewProps {
  value: SanityQuotation;
}

export function QuotationPreview({ value }: QuotationPreviewProps) {
  const { quote, attribution } = value;

  return (
    <BlockPreviewFrame label="Quotation">
      <Box paddingLeft={4} paddingY={1} style={{ borderLeft: "1px solid var(--card-border-color)" }}>
        <Stack gap={4}>
          <Text size={2} style={{ fontStyle: "italic" }}>
            {quote ?? "Empty quotation"}
          </Text>
          {isDefined(attribution) && (
            <Text size={1} muted>
              {attribution}
            </Text>
          )}
        </Stack>
      </Box>
    </BlockPreviewFrame>
  );
}

/** Preview of a quotation block, showing the quote and who it's from. */
export const QuotationBlockPreview = createBlockPreview(isBlockOf<SanityQuotation>("quotation"), QuotationPreview);
