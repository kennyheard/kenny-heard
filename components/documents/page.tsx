import { Container } from "@/components/container";
import { Content } from "@/components/content/content";
import { Section } from "@/components/section";
import { isDefined } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import type { SanityPage } from "@/sanity/schemas/documents/collections/page";
import type { Nullable } from "@/types";

export interface PageDocumentProps {
  document: Nullable<SanityPage>;
}

export function PageDocument({ document }: PageDocumentProps) {
  const { title = defaultDocumentTitle, heading, description, content } = document ?? {};

  return (
    <>
      <Section>
        <Container>
          <h1>{heading ?? title}</h1>
          {isDefined(description) && <p>{description}</p>}
        </Container>
      </Section>
      {isDefined(content) && (
        <Section>
          <Container>
            <Content content={content} />
          </Container>
        </Section>
      )}
    </>
  );
}
