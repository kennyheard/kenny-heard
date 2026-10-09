"use client";

import { useIsPresentationTool } from "next-sanity/hooks";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

import { disableDraftMode } from "@/app/actions/disable-draft-mode";

export function DraftModeToaster() {
  const isPresentationTool = useIsPresentationTool();

  useEffect(() => {
    if (isPresentationTool === false) {
      const toastId = toast("Draft mode enabled", {
        id: "draft-mode-toast",
        description: "Changes made in the Studio appear here as you edit.",
        duration: Infinity,
        action: {
          label: "Disable",
          onClick: () => {
            toast.promise(disableDraftMode(), { loading: "Disabling draft mode…" });
          },
        },
      });

      return () => {
        toast.dismiss(toastId);
      };
    }

    return undefined;
  }, [isPresentationTool]);

  return <Toaster />;
}
