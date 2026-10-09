import { definePlugin } from "sanity";

import type { SanityAnyDocumentType } from "@/sanity/config/documents";

/**
 * Creates a Studio plugin that stops authors creating, duplicating, deleting, or unpublishing documents of these types.
 *
 * @param documentTypes - The document types to lock.
 * @returns The plugin.
 */
export const lockDocumentsPlugin = definePlugin<SanityAnyDocumentType[]>((documentTypes) => {
  const lockedTypes = new Set<string>(documentTypes);

  return {
    name: "lockDocumentsPlugin",
    document: {
      newDocumentOptions: (templateItems) =>
        templateItems.filter(
          ({ templateId }) => !documentTypes.some((type) => templateId === type || templateId.startsWith(`${type}-`)),
        ),
      actions: (actionComponents, { schemaType }) => {
        if (lockedTypes.has(schemaType)) {
          return actionComponents.filter(({ action }) => !["delete", "duplicate", "unpublish"].includes(action ?? ""));
        }

        return actionComponents;
      },
    },
  };
});
