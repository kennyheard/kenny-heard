"use client";

import { Box, Card, Heading, Label, Stack } from "@sanity/ui";
import type { ComponentType, ReactNode } from "react";
import type { BlockProps, PortableTextBlock } from "sanity";

import { isDefined } from "@/lib/utils";

export interface BlockPreviewFrameProps {
  label: string;
  heading?: string;
  children?: ReactNode;
}

/**
 * Creates a block component that shows the block's content instead of its one-line summary, inside the editor's
 * usual frame and menu.
 *
 * @param isValue - Checks that a block has the value the preview reads.
 * @param Preview - Component that renders the block's content.
 * @returns The block component.
 */
export function createBlockPreview<T extends { _type: string }>(
  isValue: (value: PortableTextBlock) => value is PortableTextBlock & T,
  Preview: ComponentType<{ value: T }>,
) {
  return function BlockPreview(props: BlockProps) {
    const { value, renderDefault } = props;

    if (!isValue(value)) return renderDefault(props);

    return renderDefault({ ...props, renderPreview: () => <Preview value={value} /> });
  };
}

/**
 * Creates a check for whether a body block is of a given type.
 *
 * @param type - Name of the block type.
 * @returns The check.
 */
export function isBlockOf<T extends { _type: string }>(type: T["_type"]) {
  return (value: PortableTextBlock): value is PortableTextBlock & T => value._type === type;
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
