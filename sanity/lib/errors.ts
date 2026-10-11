"use client";

import { isCorsOriginError } from "next-sanity/live";

/**
 * Shows a Sanity Live error as a toast, loading the toast library only when there's an error to show.
 *
 * @param error - The error.
 */
async function showErrorToast(error: unknown) {
  const { toast } = await import("sonner");

  if (isCorsOriginError(error)) {
    const { addOriginUrl } = error;

    toast.error("Can't connect to Sanity Live", {
      description: "This origin isn't allowed by the Sanity project's CORS settings.",
      duration: Infinity,
      action: {
        label: "Add origin",
        onClick: () => {
          window.open(addOriginUrl, "_blank");
        },
      },
    });
  } else if (error instanceof Error) {
    toast.error(error.name, {
      description: error.message,
      duration: Infinity,
    });
  } else {
    toast.error("Unknown error", {
      description: "See the browser console for details.",
      duration: Infinity,
    });
  }
}

/**
 * Reports a Sanity Live error in the console and as a toast.
 *
 * @param error - The error.
 */
export function handleSanityLiveError(error: unknown) {
  console.error(error);
  void showErrorToast(error);
}
