import { Container } from "@/components/container";
import { PortableText } from "@/components/content/portable-text";
import { Image } from "@/components/image";
import { Section } from "@/components/section";
import { isDefined } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import type { SanityHome } from "@/sanity/schemas/documents/singletons/home";
import type { Nullable } from "@/types";

export interface HomeDocumentProps {
  document: Nullable<SanityHome>;
}

export function HomeDocument({ document }: HomeDocumentProps) {
  const { title = defaultDocumentTitle, heading, introduction, image } = document ?? {};

  return (
    <Section>
      <Container>
        <h1>{heading ?? title}</h1>
        {isDefined(introduction) && <PortableText value={introduction} />}
        {isDefined(image) && <Image image={image} profile="content" className="mt-4 rounded-lg" />}
      </Container>
    </Section>
  );
}
