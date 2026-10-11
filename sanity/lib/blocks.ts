import { createElement } from "react";
import type { ComponentType } from "react";
import type { BlockProps, PortableTextBlock } from "sanity";

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

    return renderDefault({ ...props, renderPreview: () => createElement(Preview, { value }) });
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
