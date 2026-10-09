import { defineDocumentConfig, locked } from "@/sanity/lib/documents";
import { page } from "@/sanity/schemas/documents/collections/page";
import { navigation } from "@/sanity/schemas/documents/globals/navigation";
import { settings } from "@/sanity/schemas/documents/globals/settings";
import { templates } from "@/sanity/schemas/documents/globals/templates";
import { home } from "@/sanity/schemas/documents/singletons/home";

export type SanityAnyDocumentType = (typeof config.documents)[number]["name"];

export type SanityGlobalDocumentType = (typeof config.globals)[number]["name"];

/** Document schemas grouped by role. */
const config = defineDocumentConfig({
  singletons: locked([home]),
  collections: [page],
  taxonomies: [],
  globals: locked([navigation, templates, settings]),
});

export const { singletons, collections, taxonomies, globals, documents, lockedDocumentTypes, getDocumentDefinition } =
  config;
