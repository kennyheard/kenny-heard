import { Container } from "@/components/container";
import { Entry } from "@/components/entry";
import { EntryList } from "@/components/entry-list";
import { Row } from "@/components/row";
import { RowList } from "@/components/row-list";
import { Section } from "@/components/section";
import { isDefined } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import type { SanityColophon } from "@/sanity/schemas/documents/singletons/colophon";
import type { Nullable } from "@/types";

export interface ColophonDocumentProps {
  document: Nullable<SanityColophon>;
}

export function ColophonDocument({ document }: ColophonDocumentProps) {
  const { title = defaultDocumentTitle, introduction, sections } = document ?? {};

  return (
    <>
      <h1 className="sr-only">{title}</h1>
      {isDefined(introduction) && (
        <Section type="introduction">
          <Container>
            <p className="font-intro text-muted text-pretty">{introduction}</p>
          </Container>
        </Section>
      )}
      {isDefined(sections) && (
        <Section>
          <Container>
            <RowList>
              {sections.map(({ _key, label, tools }) => (
                <Row key={_key} label={label}>
                  <EntryList>
                    {tools?.map(({ _key: toolKey, name, link, description }) => (
                      <Entry key={toolKey} title={name} description={description} link={link} />
                    ))}
                  </EntryList>
                </Row>
              ))}
            </RowList>
          </Container>
        </Section>
      )}
    </>
  );
}
