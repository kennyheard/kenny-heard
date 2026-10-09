"use server";

import { setTimeout as delay } from "node:timers/promises";

import { draftMode } from "next/headers";

/** Disables draft mode. */
export async function disableDraftMode() {
  const draftModeState = await draftMode();

  draftModeState.disable();

  // Draft mode is already off; the delay only keeps the toast's loading message on screen long enough to read.
  await delay(1000);
}
