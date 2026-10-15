import { Entry } from "@/components/entry";
import { Introduction } from "@/components/introduction";
import { Row } from "@/components/row";
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
      <Introduction title={title}>{introduction}</Introduction>
      {isDefined(sections) && (
        <Section>
          {sections.map(({ _key, label, tools }) => (
            <Row key={_key} label={label}>
              {tools?.map((tool) => (
                <Entry key={tool._key} entry={tool} />
              ))}
            </Row>
          ))}
        </Section>
      )}
    </>
  );
}
