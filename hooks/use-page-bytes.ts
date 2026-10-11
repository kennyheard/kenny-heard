import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getPageBytes } from "@/lib/page-weight";

/** How long, in milliseconds, nothing new must load before the page counts as settled. */
const settleDelay = 500;

/**
 * Measures what the current page would transfer on a visit with nothing cached, once it has finished loading, and
 * again after each move to another page.
 *
 * @returns The bytes, or undefined until the page has settled.
 */
export function usePageBytes() {
  const pathname = usePathname();
  const firstPathnameRef = useRef(pathname);
  const resourcesRef = useRef(new Map<string, PerformanceResourceTiming>());
  const [bytes, setBytes] = useState<number>();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

    function handleResources() {
      if (document.readyState !== "complete") return;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const resources = [...resourcesRef.current.values()];
        setBytes(getPageBytes(resources, pathname, pathname === firstPathnameRef.current));
      }, settleDelay);
    }

    // Requests are kept here as they arrive, because the browser stops recording them once its own buffer is full.
    function handleEntries(list: PerformanceObserverEntryList) {
      for (const entry of list.getEntries()) {
        if (entry instanceof PerformanceResourceTiming && !resourcesRef.current.has(entry.name)) {
          resourcesRef.current.set(entry.name, entry);
        }
      }

      handleResources();
    }

    window.addEventListener("load", handleResources);
    const observer = new PerformanceObserver(handleEntries);
    observer.observe({ type: "resource", buffered: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("load", handleResources);
      observer.disconnect();
    };
  }, [pathname]);

  return bytes;
}
