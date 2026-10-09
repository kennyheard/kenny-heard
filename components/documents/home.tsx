import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { isDefined } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import type { SanityHome } from "@/sanity/schemas/documents/singletons/home";
import type { Nullable } from "@/types";

export interface HomeDocumentProps {
  document: Nullable<SanityHome>;
}

export function HomeDocument({ document }: HomeDocumentProps) {
  const { title = defaultDocumentTitle, introduction } = document ?? {};

  return (
    <Section>
      <Container>
        <h1>{title}</h1>
        {isDefined(introduction) && <p>{introduction}</p>}
      </Container>
    </Section>
  );
}
