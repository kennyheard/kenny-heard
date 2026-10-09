"use client";

import { Box, Heading, Text } from "@sanity/ui";
import type { BlockStyleProps } from "sanity";

import { isDefined } from "@/lib/utils";

export type StyleProps = Partial<BlockStyleProps> & Pick<BlockStyleProps, "children">;

export function ParagraphStyle({ children, block }: StyleProps) {
  if (!isDefined(block)) return <Text size={1}>{children}</Text>;
  if (isDefined(block.listItem)) return <Text size={2}>{children}</Text>;

  return (
    <Box paddingY={1}>
      <Text size={2}>{children}</Text>
    </Box>
  );
}

export function SubheadingStyle({ children, block }: StyleProps) {
  if (!isDefined(block)) {
    return (
      <Text size={1} weight="semibold">
        {children}
      </Text>
    );
  }

  return (
    <Box paddingTop={2} paddingBottom={2}>
      <Heading size={2}>{children}</Heading>
    </Box>
  );
}
