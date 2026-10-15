import { PortableText } from "@/components/content/portable-text";
import { Entry } from "@/components/entry";
import { Feed } from "@/components/feed/feed";
import { Introduction } from "@/components/introduction";
import { Row } from "@/components/row";
import { Section } from "@/components/section";
import { getFirstPageCount } from "@/lib/feed";
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
      <Introduction title={title}>{introduction}</Introduction>
      <Section>
        {isDefined(now) && (
          <Row label="Now">
            {now.map((work) => (
              <Entry key={work._key} entry={work} />
            ))}
          </Row>
        )}
        <Feed
          items={feed ?? []}
          initialCount={getFirstPageCount(now?.length ?? 0)}
          endNote={
            isDefined([heading, body]) && (
              <Row label="Before" className="md:mt-8">
                <div className="flex flex-col gap-2">
                  {isDefined(heading) && <h3 className="font-title text-balance">{heading}</h3>}
                  {isDefined(body) && <PortableText value={body} type="note" />}
                </div>
              </Row>
            )
          }
        />
      </Section>
    </>
  );
}
