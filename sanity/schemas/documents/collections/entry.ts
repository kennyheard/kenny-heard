import { IconTasks } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { createIconPreview } from "@driftime/sanity-plugin-icon";
import type { SanityIcon } from "@driftime/sanity-plugin-icon/render";
import type { SanityLink } from "@driftime/sanity-plugin-link/render";
import { defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { createSanityIcon } from "@/lib/icons";
import { isDefined } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import { defineDocumentGroups } from "@/sanity/config/groups";
import type { DocumentGroup } from "@/sanity/config/groups";
import { iconField } from "@/sanity/schemas/fields/icon";
import type { SanityIconField } from "@/sanity/schemas/fields/icon";
import type { Strict } from "@/types";

export type SanityEntry = Strict<SanityDocument> & {
  _type: "entry";
} & SanityIconField & {
    title?: string;
    description?: string;
    link?: SanityLink;
    date?: string;
    comingSoon?: boolean;
  };

export const entry = defineType({
  name: "entry" satisfies SanityEntry["_type"],
  type: "document",
  title: "Entries",
  icon: createSanityIcon(IconTasks),
  description:
    "Things in the home page's feed that live elsewhere, such as work, side projects, and writing on other sites.",
  groups: defineDocumentGroups({ defaultGroup: "content" }),
  orderings: [
    {
      name: "dateDescending",
      title: "Newest First",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      icon: "icon",
      title: "title",
      description: "description",
      comingSoon: "comingSoon",
    },
    prepare(selection: { icon?: SanityIcon; title?: string; description?: string; comingSoon?: boolean }) {
      const { icon, title, description, comingSoon } = selection;

      return {
        title: title ?? defaultDocumentTitle,
        subtitle: comingSoon === true ? "Coming soon" : description,
        media: createIconPreview(icon),
      };
    },
  },
  fields: [
    { ...iconField, group: "content" satisfies DocumentGroup, initialValue: { name: "compass-round" } },
    defineField({
      name: "title" satisfies keyof SanityEntry,
      type: "string",
      group: "properties" satisfies DocumentGroup,
      description: "Title shown in the feed.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description" satisfies keyof SanityEntry,
      type: "string",
      group: "content" satisfies DocumentGroup,
      description: "One-line summary shown under the title in the feed.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link" satisfies keyof SanityEntry,
      type: "link",
      group: "content" satisfies DocumentGroup,
      description: "Where the entry lives. Optional while it's coming soon.",
      validation: (rule) =>
        rule.custom((link: SanityLink | undefined, context) =>
          isDefined(link) || context.document?.comingSoon === true
            ? true
            : "Add where the entry lives, or mark it as coming soon.",
        ),
    }),
    defineField({
      name: "date" satisfies keyof SanityEntry,
      type: "date",
      group: "properties" satisfies DocumentGroup,
      description:
        "Date it launched or was published, which orders it in the feed. Only the year is shown. While it's coming soon, use roughly when the work began, and change it when it launches.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "comingSoon" satisfies keyof SanityEntry,
      type: "boolean",
      group: "properties" satisfies DocumentGroup,
      description:
        "Whether the entry hasn't launched yet, so it shows faded in the feed and doesn't link anywhere. Turn it off and update the date when it launches.",
      initialValue: false,
    }),
  ],
});
