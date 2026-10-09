"use client";

import { IconArrowRotateClockwise, IconHome } from "@central-icons-react/round-outlined-radius-2-stroke-1";
import { useEffect } from "react";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Link } from "@/components/link";
import { Section } from "@/components/section";
import { defaultIconProps } from "@/config/icons";

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function Error({ error, unstable_retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section>
      <Container>
        <h1>Something went wrong</h1>
        <p>This page couldn’t be loaded. Try again, or go back to the home page.</p>
        <div className="flex flex-wrap gap-2">
          <Button onPress={unstable_retry}>
            <IconArrowRotateClockwise {...defaultIconProps} />
            Try again
          </Button>
          <Link as="button" href="/">
            <IconHome {...defaultIconProps} />
            Go home
          </Link>
        </div>
      </Container>
    </Section>
  );
}
