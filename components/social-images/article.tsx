import { SocialImageFrame } from "@/components/social-images/frame";
import type { SocialImageFrameProps } from "@/components/social-images/frame";
import { socialImageText } from "@/config/social-images";
import { formatReadingTime } from "@/lib/portable-text";
import { isDefined } from "@/lib/utils";

export type ArticleSocialImageProps = Omit<SocialImageFrameProps, "children"> & {
  title: string;
  date?: string;
  minutes?: number;
};

export function ArticleSocialImage({ name, role, title, date, minutes }: ArticleSocialImageProps) {
  // The renderer can't measure text, so titles past about two lines fill their lines instead of balancing, and stop at three.
  const isLong = title.length > 80;

  return (
    <SocialImageFrame name={name} role={role}>
      <div
        style={{
          ...socialImageText.title,
          ...(isLong && { textWrap: "wrap" }),
          display: "block",
          lineClamp: 3,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", gap: 36, ...socialImageText.details }}>
        {isDefined(date) && <span>{date}</span>}
        {isDefined(minutes) && <span>{formatReadingTime(minutes)}</span>}
      </div>
    </SocialImageFrame>
  );
}
