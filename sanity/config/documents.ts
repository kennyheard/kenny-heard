import { defineDocumentConfig, locked } from "@/sanity/lib/documents";
import { article } from "@/sanity/schemas/documents/collections/article";
import { entry } from "@/sanity/schemas/documents/collections/entry";
import { navigation } from "@/sanity/schemas/documents/globals/navigation";
import { settings } from "@/sanity/schemas/documents/globals/settings";
import { colophon } from "@/sanity/schemas/documents/singletons/colophon";
import { home } from "@/sanity/schemas/documents/singletons/home";

export type SanityAnyDocumentType = (typeof config.documents)[number]["name"];

export type SanityGlobalDocumentType = (typeof config.globals)[number]["name"];

/** Document schemas grouped by role. */
const config = defineDocumentConfig({
  singletons: locked([home, colophon]),
  collections: [article, entry],
  taxonomies: [],
  globals: locked([navigation, settings]),
});

export const { singletons, collections, taxonomies, globals, documents, lockedDocumentTypes, getDocumentDefinition } =
  config;
