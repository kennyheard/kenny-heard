"use client";

import { Heading, Text } from "@sanity/ui";
import type { BlockStyleProps } from "sanity";

export function ParagraphStyle({ children }: BlockStyleProps) {
  return <Text size={2}>{children}</Text>;
}

export function Heading2Style({ children }: BlockStyleProps) {
  return <Heading size={5}>{children}</Heading>;
}

export function Heading3Style({ children }: BlockStyleProps) {
  return <Heading size={4}>{children}</Heading>;
}

export function Heading4Style({ children }: BlockStyleProps) {
  return <Heading size={3}>{children}</Heading>;
}

export function Heading5Style({ children }: BlockStyleProps) {
  return <Heading size={2}>{children}</Heading>;
}

export function Heading6Style({ children }: BlockStyleProps) {
  return <Heading size={1}>{children}</Heading>;
}
