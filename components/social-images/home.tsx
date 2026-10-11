import { SocialImageFrame } from "@/components/social-images/frame";
import type { SocialImageFrameProps } from "@/components/social-images/frame";
import { socialImageText } from "@/config/social-images";

export type HomeSocialImageProps = Omit<SocialImageFrameProps, "children"> & {
  introduction: string;
};

export function HomeSocialImage({ name, profession, introduction }: HomeSocialImageProps) {
  return (
    <SocialImageFrame name={name} profession={profession}>
      <div style={{ maxWidth: 660, ...socialImageText.introduction }}>{introduction}</div>
    </SocialImageFrame>
  );
}
