"use client";

import Image from "next/image";

export function WorkspaceIcon() {
  return (
    <Image
      src="/icon-192.png"
      alt=""
      width={192}
      height={192}
      unoptimized
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
