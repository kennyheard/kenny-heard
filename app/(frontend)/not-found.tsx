import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-1";

import { Icon } from "@/components/icon";
import { Link } from "@/components/link";
import { Row } from "@/components/row";
import { Section } from "@/components/section";

export default function NotFound() {
  return (
    <Section type="introduction">
      <Row label="404" headingLevel={1}>
        <div className="flex flex-col gap-6">
          <p className="font-intro text-muted text-pretty">
            You’ve reached a page that doesn’t exist, which happens to all links eventually. It may have moved on when
            things were rearranged, or it may simply never have been written.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to={{ _type: "home" }} as="button">
              <Icon value={IconArrowLeft} />
              Back to the home page
            </Link>
          </div>
        </div>
      </Row>
    </Section>
  );
}
