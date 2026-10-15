"use client";

import { IconArrowLeft, IconArrowRotateClockwise } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import NextLink from "next/link";
import { useEffect } from "react";

import { Button, variants as buttonVariants } from "@/components/button";
import { Icon } from "@/components/icon";
import { Row } from "@/components/row";
import { Section } from "@/components/section";

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function Error({ error, unstable_retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section type="introduction">
      <Row label="500" headingLevel={1}>
        <div className="flex flex-col gap-6">
          <p className="font-intro text-muted text-pretty">
            Something broke behind the scenes before this page could reach you, and I’m sorry about that. These things
            tend to sort themselves out quickly, so a second try is usually all it takes.
          </p>
          <div className="flex flex-wrap gap-6">
            <NextLink href="/" className={buttonVariants()}>
              <Icon value={IconArrowLeft} />
              Back to the home page
            </NextLink>
            <Button onClick={unstable_retry}>
              <Icon value={IconArrowRotateClockwise} />
              Try again
            </Button>
          </div>
        </div>
      </Row>
    </Section>
  );
}
