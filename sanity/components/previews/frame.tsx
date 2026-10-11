"use client";

import { Box, Card, Heading, Label, Stack } from "@sanity/ui";
import type { ReactNode } from "react";

import { isDefined } from "@/lib/utils";

export interface BlockPreviewFrameProps {
  label: string;
  heading?: string;
  children?: ReactNode;
}

export function BlockPreviewFrame({ label, heading, children }: BlockPreviewFrameProps) {
  return (
    <Box padding={1}>
      <Card padding={4} radius={3} tone="transparent">
        <Stack gap={4}>
          <Label size={1} muted>
            {label}
          </Label>
          {isDefined(heading) && (
            <Heading size={1} weight="semibold">
              {heading}
            </Heading>
          )}
          {children}
        </Stack>
      </Card>
    </Box>
  );
}
