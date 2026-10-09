"use client";

import { TextArea, useTheme } from "@sanity/ui";
import type { TextInputProps } from "sanity";

export type CodeInputProps = TextInputProps;

export function CodeInput(props: CodeInputProps) {
  const { elementProps, schemaType, validationError } = props;
  const { sanity } = useTheme();

  return (
    <TextArea
      {...elementProps}
      rows={schemaType.rows}
      spellCheck={false}
      customValidity={validationError}
      style={{ fontFamily: sanity.v2?.font.code.family }}
    />
  );
}
