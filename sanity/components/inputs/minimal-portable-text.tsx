"use client";

import { Box } from "@sanity/ui";
import { useId } from "react";
import type { ArrayOfObjectsInputProps } from "sanity";

import { isDefined } from "@/lib/utils";

export type MinimalPortableTextProps = ArrayOfObjectsInputProps;

/** Editor height in pixels for fields that don't set `editorHeight`. */
const defaultEditorHeight = 220;

export function MinimalPortableText(props: MinimalPortableTextProps) {
  const { schemaType, renderDefault } = props;
  const id = useId();
  const { options } = schemaType;
  const editorHeight =
    isDefined(options) && "editorHeight" in options && typeof options.editorHeight === "number"
      ? options.editorHeight
      : defaultEditorHeight;

  // Sanity has no height option, so this targets its attributes, which a Studio upgrade could rename.
  return (
    <Box data-minimal-id={id}>
      <style>{`[data-minimal-id="${id}"] [data-testid="pt-editor"][data-fullscreen="false"] { height: ${editorHeight}px; }`}</style>
      {renderDefault(props)}
    </Box>
  );
}
