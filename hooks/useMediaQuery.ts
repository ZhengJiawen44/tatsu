// hooks/useMediaQuery.js
"use client";
import { useState, useEffect, ChangeEvent } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener function
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Add listener
    media.addEventListener("change", listener);

    // Remove listener on cleanup
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
