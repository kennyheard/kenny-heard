import {
  ImageIcon,
  ListCollapseIcon,
  PaletteIcon,
  PanelBottomIcon,
  PanelTopIcon,
  PencilLineIcon,
  SearchIcon,
  ToggleLeftIcon,
} from "lucide-react";

import { defineDocumentGroupConfig } from "@/sanity/lib/groups";

export type DocumentGroup = keyof typeof config.documentGroups;

/** Field group tabs available to every document, in display order. */
const config = defineDocumentGroupConfig({
  header: { icon: PanelTopIcon },
  footer: { icon: PanelBottomIcon },
  properties: { icon: ListCollapseIcon },
  content: { icon: PencilLineIcon },
  media: { icon: ImageIcon },
  appearance: { icon: PaletteIcon },
  seo: { title: "SEO", icon: SearchIcon },
  settings: { icon: ToggleLeftIcon },
});

export const { documentGroups, defineDocumentGroups } = config;
