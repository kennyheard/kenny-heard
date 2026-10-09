import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import { defineField } from "sanity";

export interface SanityIconField {
  icon?: SanityIcon;
}

export const iconField = defineField({
  name: "icon" satisfies keyof SanityIconField,
  type: "icon",
  description: "Icon shown before the title, marking what kind of thing it is.",
  options: {
    library: "central",
    style: "round-outlined-radius-2-stroke-1",
    icons: ["compass-round", "feather", "code-brackets", "microphone"],
  },
  validation: (rule) => rule.required(),
});
