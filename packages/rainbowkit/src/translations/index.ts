import en_US from './en_US.json';

interface TranslationOptions {
  rawKeyIfTranslationMissing?: boolean;
}

type TranslationObject = Record<string, unknown>;
type Replacements = Record<string, string | number>;

const normalizeTranslations = (
  translationModule: unknown,
): TranslationObject => {
  if (typeof translationModule === 'string') {
    return JSON.parse(translationModule) as TranslationObject;
  }

  if (typeof translationModule !== 'object' || translationModule === null) {
    return {};
  }

  const defaultExport = (translationModule as TranslationObject).default;

  if (defaultExport !== undefined) {
    return normalizeTranslations(defaultExport);
  }

  return translationModule as TranslationObject;
};

const flattenTranslations = (
  translationObject: TranslationObject,
  parentKey?: string,
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(translationObject)) {
    const nextKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'string') {
      result[nextKey] = value;
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      Object.assign(
        result,
        flattenTranslations(value as TranslationObject, nextKey),
      );
    }
  }

  return result;
};

const translations = flattenTranslations(
  normalizeTranslations(en_US as TranslationObject),
);

const applyReplacements = (
  translation: string,
  replacements: Replacements = {},
) => {
  let translated = translation;

  for (const [placeholder, replacement] of Object.entries(replacements)) {
    translated = translated
      .split(`%{${placeholder}}`)
      .join(String(replacement));
  }

  return translated;
};

export const t = (
  key: string,
  replacements?: Replacements,
  options?: TranslationOptions,
) => {
  const translation = translations[key];

  if (!translation) {
    return options?.rawKeyIfTranslationMissing
      ? key
      : `[missing: "${key}" translation]`;
  }

  return applyReplacements(translation, replacements);
};
