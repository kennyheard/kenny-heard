import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
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
import { geistMono, timelessSans, timelessSerif } from "@/config/fonts";
import { resolveMetadata } from "@/config/metadata";
import { darkSchemeQuery, lightSchemeQuery, themeColors, themeScript } from "@/config/theme";
import { identityQuery, navigationQuery } from "@/sanity/groq/documents";
import { handleSanityLiveError } from "@/sanity/lib/errors";
import { SanityLive, getDynamicFetchOptions, sanityFetch } from "@/sanity/lib/live";
import type { DynamicFetchOptions } from "@/sanity/lib/live";

import "@/app/styles/globals.css";

export const metadata: Metadata = resolveMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: lightSchemeQuery, color: themeColors.light.background },
    { media: darkSchemeQuery, color: themeColors.dark.background },
  ],
};

// oxlint-disable-next-line react/no-danger -- The theme must apply before first paint, which only an inline script can do.
const themeScriptElement = <script dangerouslySetInnerHTML={{ __html: themeScript }} />;

export default async function FrontendLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={cn(
        timelessSans.variable,
        timelessSerif.variable,
        geistMono.variable,
        "bg-background text-base antialiased scheme-light dark:scheme-dark",
      )}
    >
      <head>{themeScriptElement}</head>
      <body id="top" className="text-foreground font-sans">
        <div className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-4 focus-within:left-4 focus-within:z-100">
          <Link as="button" href="#main">
            Skip to content
          </Link>
        </div>
        <Providers>
          <div className="flex min-h-dvh flex-col px-8 py-12 md:py-16">
            {isDraftMode ? (
              <Suspense fallback={<Header />}>
                <DynamicHeader />
              </Suspense>
            ) : (
              <CachedHeader perspective="published" stega={false} />
            )}
            <Main className="flex flex-1 flex-col">{children}</Main>
            {isDraftMode ? (
              <Suspense fallback={<Footer />}>
                <DynamicFooter />
              </Suspense>
            ) : (
              <CachedFooter perspective="published" stega={false} />
            )}
          </div>
          <SanityLive onError={handleSanityLiveError} includeDrafts={isDraftMode} />
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
        </Providers>
        <Analytics />
        <SpeedInsights />
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

  const { data: identity } = await sanityFetch({ query: identityQuery, perspective, stega });
  const { name, profession } = identity ?? {};

  return <Header name={name} profession={profession} />;
}

async function DynamicFooter() {
  const { perspective, stega } = await getDynamicFetchOptions();

  return <CachedFooter perspective={perspective} stega={stega} />;
}

async function CachedFooter({ perspective, stega }: DynamicFetchOptions) {
  "use cache";

  const { data: navigation } = await sanityFetch({ query: navigationQuery, perspective, stega });
  const { footer, social } = navigation ?? {};

  return <Footer menu={footer} social={social} />;
}
