export const regionCode = (localeCode) => {
  const split = localeCode.toLowerCase().split("-");
  return split[split.length - 1];
};

const translationsSubQuery = (locale) => `
  ${regionCode(locale.code)}: translations(locale: "${locale.code}") {
    key
    locale
    value
  }
`;

export const translationsSubQueries = (locales) => `
  ${locales.map(translationsSubQuery)}
`;

export const translations = (resourceWithTranslations, localeCode) =>
  resourceWithTranslations[regionCode(localeCode)];

export const translation = (resourceWithTranslations, localeCode, key) =>
  translations(resourceWithTranslations, localeCode)
    .find((translation) => translation.key === key)?.value;

export const translationsCount = (resourceWithTranslations, localeCode) =>
  translations(resourceWithTranslations, localeCode).length;
