"use client";

import dynamic from "next/dynamic";

export const DraftModeToast = dynamic(
  async () => {
    const { DraftModeToaster } = await import("@/components/sanity/draft-mode-toaster");
    return DraftModeToaster;
  },
  { ssr: false },
);
