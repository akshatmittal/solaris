import { useEffect, useState } from "react";

export type CopyResult = "copied" | "failed";

export function useCopyToClipboard(value: string | undefined) {
  const [attempt, setAttempt] = useState<{ result: CopyResult; value: string }>();

  useEffect(() => {
    if (attempt) {
      const timer = setTimeout(() => setAttempt(undefined), 1500);
      return () => clearTimeout(timer);
    }
  }, [attempt]);

  const copy = () => {
    if (value) {
      try {
        void navigator.clipboard.writeText(value).then(
          () => setAttempt({ result: "copied", value }),
          () => setAttempt({ result: "failed", value }),
        );
      } catch {
        setAttempt({ result: "failed", value });
      }
    }
  };

  return { copy, result: attempt && attempt.value === value ? attempt.result : undefined };
}
