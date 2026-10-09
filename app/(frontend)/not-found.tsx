import { IconHome } from "@central-icons-react/round-outlined-radius-2-stroke-1";

import { Container } from "@/components/container";
import { Link } from "@/components/link";
import { Section } from "@/components/section";
import { defaultIconProps } from "@/config/icons";

export default function NotFound() {
  return (
    <Section>
      <Container>
        <h1>Page not found</h1>
        <p>This page doesn’t exist or has moved.</p>
        <Link as="button" href="/">
          <IconHome {...defaultIconProps} />
          Go home
        </Link>
      </Container>
    </Section>
  );
}
