"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { RouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    /** Options React Aria links pass through to the Next.js router. */
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export interface ProvidersProps {
  children: ReactNode;
}

/**
 * Gives everything inside it client-side navigation for React Aria links.
 *
 * @returns The providers wrapping the page.
 */
export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <RouterProvider
      navigate={(path, options) => {
        router.push(path, options);
      }}
    >
      {children}
    </RouterProvider>
  );
}
