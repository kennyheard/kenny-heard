import type { CentralIconBaseProps } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import type { SanityIconName } from "@driftime/sanity-plugin-icon";

/** Default props for icons on the site, whose lines stay 1px at any size. */
export const defaultIconProps: CentralIconBaseProps = { size: "1rem", strokeWidth: 1 };

/** Default props for icons in the Studio. */
export const defaultSanityIconProps: CentralIconBaseProps = { size: "1em" };

/** Central icons an author can choose to mark what kind of thing an article, entry, or work is. */
export const iconFieldNames: SanityIconName<"central">[] = ["compass-round", "feather", "code-brackets", "microphone"];
