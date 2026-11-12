import { useSyncExternalStore } from "react";

// Matches media.largeScreen, where the dialog replaces the sheet.
const query = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const list = window.matchMedia(query);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

export function useLargeScreen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
