import { accessibleImage } from "@/sanity/schemas/types/accessible-image";
import { button } from "@/sanity/schemas/types/button";
import { content } from "@/sanity/schemas/types/content";
import { extendedPortableText } from "@/sanity/schemas/types/extended-portable-text";
import { minimalPortableText } from "@/sanity/schemas/types/minimal-portable-text";
import { navigationMenu } from "@/sanity/schemas/types/navigation-menu";
import { standardPortableText } from "@/sanity/schemas/types/standard-portable-text";

/** Reusable schema types, for registering with the Studio. */
export const types = [
  accessibleImage,
  button,
  minimalPortableText,
  standardPortableText,
  extendedPortableText,
  content,
  navigationMenu,
];
