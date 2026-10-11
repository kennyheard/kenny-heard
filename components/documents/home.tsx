import { Container } from "@/components/container";
import { PortableText } from "@/components/content/portable-text";
import { Entry } from "@/components/entry";
import { EntryList } from "@/components/entry-list";
import { Feed } from "@/components/feed";
import { Introduction } from "@/components/introduction";
import { Row } from "@/components/row";
import { RowList } from "@/components/row-list";
import { Section } from "@/components/section";
import { feedPageSize } from "@/config/feed";
import { getFirstPageCount, toFeedEntry } from "@/lib/feed";
import type { SanityFeedItem } from "@/lib/feed";
import { isDefined } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import type { SanityHome } from "@/sanity/schemas/documents/singletons/home";
import type { Nullable } from "@/types";

export interface HomeDocumentProps {
  document: Nullable<SanityHome>;
  feed: Nullable<SanityFeedItem[]>;
}

export function HomeDocument({ document, feed }: HomeDocumentProps) {
  const { title = defaultDocumentTitle, introduction, now, endNote } = document ?? {};
  const { heading, body } = endNote ?? {};

  return (
    <>
      <h1 className="sr-only">{title}</h1>
      {isDefined(introduction) && <Introduction>{introduction}</Introduction>}
      <Section>
        <Container>
          <RowList>
            {isDefined(now) && (
              <Row label="Now">
                <EntryList>
                  {now.map((work) => (
                    <Entry key={work._key} icon={work.icon} title={work.title} description={work.description} />
                  ))}
                </EntryList>
              </Row>
            )}
            <Feed
              entries={feed?.map((item) => toFeedEntry(item)) ?? []}
              pageSize={feedPageSize}
              initialCount={getFirstPageCount(now?.length ?? 0)}
            >
              {isDefined([heading, body]) && (
                <Row label="Before" className="md:mt-8">
                  <div className="flex flex-col gap-2">
                    {isDefined(heading) && <h3 className="font-title text-balance">{heading}</h3>}
                    {isDefined(body) && <PortableText value={body} type="note" />}
                  </div>
                </Row>
              )}
            </Feed>
          </RowList>
        </Container>
      </Section>
    </>
  );
}
