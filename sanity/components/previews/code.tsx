"use client";

import { Box, Text, useTheme } from "@sanity/ui";

import { isDefined } from "@/lib/utils";
import { BlockPreviewFrame, createBlockPreview, isBlockOf } from "@/sanity/components/previews/frame";
import type { SanityCode } from "@/sanity/schemas/blocks/code";

export interface CodePreviewProps {
  value: SanityCode;
}

export function CodePreview({ value }: CodePreviewProps) {
  const { filename, code } = value;
  const { sanity } = useTheme();

  return (
    <BlockPreviewFrame label="Code" heading={filename}>
      {isDefined(code) && (
        <Box overflow="auto">
          <Text size={1} style={{ fontFamily: sanity.v2?.font.code.family, whiteSpace: "pre" }}>
            {code}
          </Text>
        </Box>
      )}
    </BlockPreviewFrame>
  );
}

/** Preview of a code block, showing its file name and code. */
export const CodeBlockPreview = createBlockPreview(isBlockOf<SanityCode>("code"), CodePreview);
