"use client";

import { linkPlugin } from "@driftime/sanity-plugin-link";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { routes } from "@/config/routes";
import { objectKeys } from "@/lib/utils";
import { documents, lockedDocumentTypes } from "@/sanity/config/documents";
import { types } from "@/sanity/config/types";
import { dataset, draftApiUrl, projectId, studioUrl } from "@/sanity/lib/api";
import { lockDocumentsPlugin } from "@/sanity/plugins/lock-documents";
import { locations, mainDocuments } from "@/sanity/plugins/resolve";
import { structure } from "@/sanity/plugins/structure";

export default defineConfig({
  projectId,
  dataset,
  basePath: studioUrl,
  name: "cairn",
  title: "Cairn",
  schema: {
    types: [...documents, ...types],
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve: {
        mainDocuments,
        locations,
      },
      previewUrl: {
        previewMode: {
          enable: draftApiUrl,
        },
      },
    }),
    linkPlugin({ documentTypes: objectKeys(routes) }),
    lockDocumentsPlugin(lockedDocumentTypes),
  ],
});
