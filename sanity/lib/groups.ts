import type { FieldGroupDefinition } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import type { CentralIcon } from "@/lib/icons";
import { convertCase, objectEntries } from "@/lib/utils";

/** Field group tab in the document editor. */
export interface DocumentGroupDefinition {
  /** Tab title, or undefined to title-case the group name. */
  title?: string;
  /** Icon shown on the tab. */
  icon: CentralIcon;
}

/** Field group tabs keyed by name. */
export type DocumentGroupConfig<T extends string> = Record<T, DocumentGroupDefinition>;

/**
 * Creates field group helpers bound to a set of tabs.
 *
 * @param documentGroupConfig - The tabs, keyed by name, in display order.
 * @returns The tabs and a builder for a document's `groups`.
 */
export function defineDocumentGroupConfig<T extends string>(documentGroupConfig: DocumentGroupConfig<T>) {
  type DocumentGroup = T;

  /** Options for a document's field group tabs. */
  interface DocumentGroupsProps {
    /** Tab that opens first. */
    defaultGroup?: DocumentGroup;
  }

  /** Field group tabs keyed by name. */
  const documentGroups = documentGroupConfig;

  /**
   * Builds the field group tabs for a document schema. The Studio hides any tab without fields.
   *
   * @returns The document's `groups`.
   */
  function defineDocumentGroups({ defaultGroup }: DocumentGroupsProps = {}) {
    return objectEntries(documentGroups).map(([name, { title, icon }]): FieldGroupDefinition => ({
      name,
      title: title ?? convertCase(name, "title"),
      icon: createSanityIcon(icon, { color: "var(--card-muted-fg-color)" }),
      default: name === defaultGroup,
    }));
  }

  return { documentGroups, defineDocumentGroups };
}
