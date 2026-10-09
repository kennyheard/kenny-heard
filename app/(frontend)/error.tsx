"use client";

import { IconArrowLeft, IconArrowRotateClockwise } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { useEffect } from "react";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Icon } from "@/components/icon";
import { Link } from "@/components/link";
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
      <Container>
        <Row label="500" headingLevel={1}>
          <div className="flex flex-col gap-6">
            <p className="font-intro text-muted text-pretty">
              Something broke behind the scenes before this page could reach you, and I’m sorry about that. These things
              tend to sort themselves out quickly, so a second try is usually all it takes.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link as="button" href="/">
                <Icon icon={IconArrowLeft} size="1rem" tone="inherit" />
                Back to the home page
              </Link>
              <Button onPress={unstable_retry}>
                <Icon icon={IconArrowRotateClockwise} size="1rem" tone="inherit" />
                Try again
              </Button>
            </div>
          </div>
        </Row>
      </Container>
    </Section>
  );
}
