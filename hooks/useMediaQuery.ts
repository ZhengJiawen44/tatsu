// hooks/useMediaQuery.js
"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener function
    const listener = (e) => setMatches(e.matches);

    // Add listener
    media.addEventListener("change", listener);

    // Remove listener on cleanup
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
