import { IconShapesPlusXSquareCircle } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import type { DocumentDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";

import { routes } from "@/config/routes";
import { createSanityIcon } from "@/lib/icons";
import { convertCase, isDefined } from "@/lib/utils";
import { collections, globals, singletons, taxonomies } from "@/sanity/config/documents";
import type { DocumentConfig } from "@/sanity/lib/documents";

/**
 * Builds the Studio sidebar, with a section for each document role.
 *
 * @param structureBuilder - The structure builder.
 * @returns The sidebar.
 */
export function structure(...[structureBuilder]: Parameters<StructureResolver>) {
  const { list, listItem, document, documentTypeList, divider } = structureBuilder;

  /**
   * Builds a sidebar item that opens a single document.
   *
   * @param item - The document schema.
   * @returns The sidebar item.
   */
  function createDocumentItem(item: DocumentDefinition) {
    const { name, title, icon } = item;

    return listItem()
      .id(name)
      .title(title ?? convertCase(name, "title"))
      .icon(icon)
      .child(
        document()
          .id(name)
          .schemaType(name)
          .title(title ?? convertCase(name, "title")),
      );
  }

  /**
   * Builds a sidebar item that lists every document of a type.
   *
   * @param item - The document schema.
   * @returns The sidebar item.
   */
  function createDocumentList(item: DocumentDefinition) {
    const { name, title, icon } = item;

    return listItem()
      .id(name)
      .title(title ?? convertCase(name, "title"))
      .icon(icon)
      .child(documentTypeList(name).title(title ?? convertCase(name, "title")));
  }

  /**
   * Builds a sidebar item for a taxonomy, nesting a list per type unless it has only one.
   *
   * @param taxonomy - The taxonomy.
   * @returns The sidebar item.
   */
  function createTaxonomyItem(taxonomy: DocumentConfig["taxonomies"][number]) {
    const { id, title, icon, schemas } = taxonomy;
    const [singleSchema] = schemas;

    if (schemas.length === 1 && isDefined(singleSchema)) return createDocumentList(singleSchema);

    const taxonomyItems = schemas.map((schema) => createDocumentList(schema));

    return listItem()
      .id(id)
      .title(title ?? convertCase(id, "title"))
      .icon(icon ?? createSanityIcon(IconShapesPlusXSquareCircle))
      .child(
        list()
          .title(title ?? convertCase(id, "title"))
          .items(taxonomyItems),
      );
  }

  const singletonItems = singletons.map((singleton) => createDocumentItem(singleton));
  const routedCollectionItems = collections
    .filter(({ name }) => name in routes)
    .map((collection) => createDocumentList(collection));
  const unroutedCollectionItems = collections
    .filter(({ name }) => !(name in routes))
    .map((collection) => createDocumentList(collection));
  const taxonomyItems = taxonomies.map((taxonomy) => createTaxonomyItem(taxonomy));
  const globalItems = globals.map((global) => createDocumentItem(global));

  const sections = [singletonItems, routedCollectionItems, unroutedCollectionItems, taxonomyItems, globalItems];

  return list()
    .title("Content")
    .items(
      sections
        .filter((section) => isDefined(section))
        .flatMap((section, index) => (index > 0 ? [divider(), ...section] : section)),
    );
}
