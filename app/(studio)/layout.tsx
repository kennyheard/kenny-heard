import type { Metadata } from "next";
import type { ReactNode } from "react";

import { icons } from "@/config/metadata";

export interface StudioLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = { icons };

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
