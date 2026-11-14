"use client";

import { useQueryStates } from "nuqs";

import { kitSettings, themeNames } from "./settings";

export function SettingsControls() {
  const [{ siwe, theme }, setSettings] = useQueryStates(kitSettings);

  return (
    <div className="settings">
      <div
        aria-label="Theme"
        className="segmented"
        role="group"
      >
        {themeNames.map((option) => (
          <button
            aria-pressed={option === theme}
            key={option}
            onClick={() => setSettings({ theme: option })}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <div
        aria-label="Sign-In with Ethereum"
        className="segmented"
        role="group"
      >
        {[true, false].map((option) => (
          <button
            aria-pressed={option === siwe}
            key={String(option)}
            onClick={() => setSettings({ siwe: option })}
            type="button"
          >
            {option ? "SIWE" : "No SIWE"}
          </button>
        ))}
      </div>
    </div>
  );
}
