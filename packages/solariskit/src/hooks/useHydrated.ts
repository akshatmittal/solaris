import { useEffect, useState } from "react";

/**
 * False on the server and for the first client render, true after hydration.
 * Components gate on this so their SSR markup never depends on client-only
 * state (wallet extensions, media queries, localStorage).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
