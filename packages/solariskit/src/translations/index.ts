import en_US from "./en_US.json";

interface TranslationOptions {
  rawKeyIfTranslationMissing?: boolean;
}

type TranslationObject = Record<string, unknown>;
type Replacements = Record<string, string | number>;

const flattenTranslations = (translationObject: TranslationObject, parentKey?: string): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(translationObject)) {
    const nextKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "string") {
      result[nextKey] = value;
      continue;
    }

    if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenTranslations(value as TranslationObject, nextKey));
    }
  }

  return result;
};

const translations = flattenTranslations(en_US);

const applyReplacements = (translation: string, replacements: Replacements = {}) => {
  let translated = translation;

  for (const [placeholder, replacement] of Object.entries(replacements)) {
    translated = translated.split(`%{${placeholder}}`).join(String(replacement));
  }

  return translated;
};

export const t = (key: string, replacements?: Replacements, options?: TranslationOptions) => {
  const translation = translations[key];

  if (!translation) {
    return options?.rawKeyIfTranslationMissing ? key : `[missing: "${key}" translation]`;
  }

  return applyReplacements(translation, replacements);
};
