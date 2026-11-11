"use client";

import { useQueryStates } from "nuqs";

import { kitSettings, modalSizes, themeNames } from "./settings";

function Segmented<Option extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (option: Option) => void;
  options: readonly Option[];
  value: Option;
}) {
  return (
    <div
      aria-label={label}
      className="segmented"
      role="group"
    >
      {options.map((option) => (
        <button
          aria-pressed={option === value}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function SettingsControls() {
  const [{ modal, theme }, setSettings] = useQueryStates(kitSettings);

  return (
    <div className="settings">
      <Segmented
        label="Modal size"
        onChange={(option) => setSettings({ modal: option })}
        options={modalSizes}
        value={modal}
      />
      <Segmented
        label="Theme"
        onChange={(option) => setSettings({ theme: option })}
        options={themeNames}
        value={theme}
      />
    </div>
  );
}
