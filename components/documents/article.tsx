import { IconArrowUp } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { stegaClean } from "next-sanity";

import { Container } from "@/components/container";
import { PortableText } from "@/components/content/portable-text";
import { Icon } from "@/components/icon";
import { Link } from "@/components/link";
import { Section } from "@/components/section";
import { ShareButton } from "@/components/share-button";
import { getDatestamp } from "@/config/dates";
import { formatReadingTime, getReadingMinutes } from "@/lib/portable-text";
import { isDefined } from "@/lib/utils";
import { defaultDocumentTitle } from "@/sanity/config/defaults";
import type { SanityArticle } from "@/sanity/schemas/documents/collections/article";
import type { Nullable } from "@/types";

export interface ArticleDocumentProps {
  document: Nullable<SanityArticle>;
}

export function ArticleDocument({ document }: ArticleDocumentProps) {
  const { title = defaultDocumentTitle, date, body } = document ?? {};
  const minutes = isDefined(body) ? getReadingMinutes(body) : undefined;

  return (
    <Section>
      <Container>
        <article className="flex flex-col gap-8 md:gap-12">
          <header className="flex flex-col gap-3">
            <h1 className="font-heading text-balance">{title}</h1>
            <p className="font-meta text-muted flex flex-wrap gap-x-6 gap-y-3">
              {isDefined(date) && <time dateTime={stegaClean(date)}>{getDatestamp(stegaClean(date))}</time>}
              {isDefined(minutes) && <span>{formatReadingTime(minutes)}</span>}
            </p>
          </header>
          {isDefined(body) && <PortableText value={body} />}
          <footer className="flex items-center justify-between gap-6">
            <ShareButton title={stegaClean(title)} />
            <Link as="button" href="#top">
              <Icon icon={IconArrowUp} size="1rem" tone="inherit" />
              Top
            </Link>
          </footer>
        </article>
      </Container>
    </Section>
  );
}
