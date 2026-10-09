import { SocialImageFrame } from "@/components/social-images/frame";
import type { SocialImageFrameProps } from "@/components/social-images/frame";
import { socialImageText } from "@/config/social-images";
import { isDefined } from "@/lib/utils";

export type ColophonSocialImageProps = Omit<SocialImageFrameProps, "children"> & {
  title: string;
  introduction?: string;
};

export function ColophonSocialImage({ name, role, title, introduction }: ColophonSocialImageProps) {
  return (
    <SocialImageFrame name={name} role={role}>
      <div style={socialImageText.title}>{title}</div>
      {isDefined(introduction) && <div style={socialImageText.introduction}>{introduction}</div>}
    </SocialImageFrame>
  );
}
