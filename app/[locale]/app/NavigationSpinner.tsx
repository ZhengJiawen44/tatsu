"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "@/components/ui/spinner";

export default function NavigationSpinner() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      setPending(true);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/60">
      <Spinner className="h-16 w-16 text-foreground" />
    </div>
  );
}
