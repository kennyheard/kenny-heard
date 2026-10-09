import type { DocumentDefinition } from "sanity";
import type { ListItemInput } from "sanity/structure";

import { isDefined } from "@/lib/utils";

/** Document schemas grouped by the role they play in the content model. */
export interface DocumentConfig {
  /** Documents with one instance, such as the home page. */
  singletons: DocumentDefinition[];
  /** Documents with many instances, such as pages. */
  collections: DocumentDefinition[];
  /** Documents that categorise other content, grouped under one sidebar item per taxonomy. */
  taxonomies: (ListItemInput & { schemas: DocumentDefinition[] })[];
  /** Documents with one instance that hold site-wide content and settings, with no page of their own. */
  globals: DocumentDefinition[];
}

/** Schemas marked as locked. */
const lockedSchemas = new Set<DocumentDefinition>();

/**
 * Marks schemas whose documents authors can't create, duplicate, delete, or unpublish.
 *
 * @param schemas - The schemas to lock.
 * @returns The schemas, unchanged.
 */
export function locked<S extends DocumentDefinition[]>(schemas: S) {
  for (const schema of schemas) lockedSchemas.add(schema);

  return schemas;
}

/**
 * Creates document helpers bound to the content model.
 *
 * @param documentConfig - The document schemas, grouped by role.
 * @returns The roles, every schema in one list, the locked document types, and a lookup by type.
 */
export function defineDocumentConfig<const T extends DocumentConfig>(documentConfig: T) {
  type DocumentSchema =
    | T["singletons"][number]
    | T["collections"][number]
    | T["taxonomies"][number]["schemas"][number]
    | T["globals"][number];

  type DocumentType = DocumentSchema["name"];

  const { singletons, collections, taxonomies, globals } = documentConfig;

  /** Every document schema, for registering with the Studio. */
  const documents: DocumentSchema[] = [
    ...singletons,
    ...collections,
    ...taxonomies.flatMap(({ schemas }) => schemas),
    ...globals,
  ];

  /** Document types marked as locked. */
  const lockedDocumentTypes: DocumentType[] = documents
    .filter((document) => lockedSchemas.has(document))
    .map(({ name }) => name);

  /**
   * Finds the schema for a document type.
   *
   * @param type - The document type.
   * @returns The schema, or undefined when no schema matches.
   */
  function getDocumentDefinition(type: DocumentType | undefined) {
    if (!isDefined(type)) return undefined;

    return documents.find((document) => document.name === type);
  }

  return { ...documentConfig, documents, lockedDocumentTypes, getDocumentDefinition };
}
