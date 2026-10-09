"use client";

import { Flex, Stack, Text } from "@sanity/ui";

import { isDefined } from "@/lib/utils";
import { BlockPreviewFrame, createBlockPreview, isBlockOf } from "@/sanity/components/previews/frame";
import type { SanityDefinition } from "@/sanity/schemas/blocks/definition";

export interface DefinitionPreviewProps {
  value: SanityDefinition;
}

export function DefinitionPreview({ value }: DefinitionPreviewProps) {
  const { term, pronunciation, wordClass, sense, origin } = value;

  return (
    <BlockPreviewFrame label="Definition" heading={term ?? "Empty definition"}>
      <Stack gap={4}>
        {isDefined([pronunciation, wordClass]) && (
          <Flex gap={3} wrap="wrap">
            {isDefined(pronunciation) && (
              <Text size={1} muted>
                {pronunciation}
              </Text>
            )}
            {isDefined(wordClass) && (
              <Text size={1} muted style={{ fontStyle: "italic" }}>
                {wordClass}
              </Text>
            )}
          </Flex>
        )}
        {isDefined(sense) && (
          <Text size={2} style={{ fontStyle: "italic" }}>
            {sense}
          </Text>
        )}
        {isDefined(origin) && (
          <Text size={1} muted>
            {origin}
          </Text>
        )}
      </Stack>
    </BlockPreviewFrame>
  );
}

/** Preview of a definition block, set like the dictionary entry it shows. */
export const DefinitionBlockPreview = createBlockPreview(isBlockOf<SanityDefinition>("definition"), DefinitionPreview);
