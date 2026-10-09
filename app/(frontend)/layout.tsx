import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { cn } from "tailwind-variants";

import { Providers } from "@/app/(frontend)/providers";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Link } from "@/components/link";
import { Main } from "@/components/main";
import { DraftModeToast } from "@/components/sanity/draft-mode-toast";
import { geist } from "@/config/fonts";
import { resolveMetadata } from "@/config/metadata";
import { navigationQuery, templatesQuery } from "@/sanity/groq/documents";
import { handleSanityLiveError } from "@/sanity/lib/errors";
import { SanityLive, getDynamicFetchOptions, sanityFetch } from "@/sanity/lib/live";
import type { DynamicFetchOptions } from "@/sanity/lib/live";

import "@/app/styles/globals.css";

export const metadata: Metadata = resolveMetadata();

export default async function FrontendLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en-GB" className={cn(geist.variable, "font-p antialiased")}>
      <body className="bg-neutral-50 text-black">
        <Link as="button" href="#main" className="fixed top-0 left-4 z-100 -translate-y-full focus:translate-y-4">
          Skip to content
        </Link>
        <Providers>
          {isDraftMode ? (
            <Suspense fallback={<Header />}>
              <DynamicHeader />
            </Suspense>
          ) : (
            <CachedHeader perspective="published" stega={false} />
          )}
          <Main>{children}</Main>
          {isDraftMode ? (
            <Suspense fallback={<Footer />}>
              <DynamicFooter />
            </Suspense>
          ) : (
            <CachedFooter perspective="published" stega={false} />
          )}
          <SanityLive onError={handleSanityLiveError} includeDrafts={isDraftMode} />
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}

async function DynamicHeader() {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedHeader perspective={perspective} stega={stega} />;
}

async function CachedHeader({ perspective, stega }: DynamicFetchOptions) {
  "use cache";

  const { data: navigation } = await sanityFetch({ query: navigationQuery, perspective, stega });

  return <Header menu={navigation?.header} />;
}

async function DynamicFooter() {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedFooter perspective={perspective} stega={stega} />;
}

async function CachedFooter({ perspective, stega }: DynamicFetchOptions) {
  "use cache";

  const { data: templates } = await sanityFetch({ query: templatesQuery, perspective, stega });

  return <Footer attribution={templates?.attribution} />;
}
