import {
  IconColorPalette,
  IconImages1,
  IconLayoutBottom,
  IconLayoutTop,
  IconMagnifyingGlass,
  IconPencilLine,
  IconSettingsSliderThree,
  IconSettingsToggle1,
} from "@central-icons-react/round-outlined-radius-2-stroke-1";

import { defineDocumentGroupConfig } from "@/sanity/lib/groups";

export type DocumentGroup = keyof typeof config.documentGroups;

/** Field group tabs available to every document, in display order. */
const config = defineDocumentGroupConfig({
  header: { icon: IconLayoutTop },
  footer: { icon: IconLayoutBottom },
  properties: { icon: IconSettingsSliderThree },
  content: { icon: IconPencilLine },
  media: { icon: IconImages1 },
  appearance: { icon: IconColorPalette },
  seo: { title: "SEO", icon: IconMagnifyingGlass },
  settings: { icon: IconSettingsToggle1 },
});

export const { documentGroups, defineDocumentGroups } = config;
