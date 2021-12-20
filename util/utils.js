import { useQuery } from "@apollo/client";
import React from "react";

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

export const usePaginatedQuery = (
  query, pageLimit, resultsFieldName, options,
) => {
  const [page, setPage] = React.useState(0);
  const { data, loading, fetchMore } = useQuery(
    query,
    {
      ...options,
      notifyOnNetworkStatusChange: true,
      variables: { limit: pageLimit },
    });

  const results = React.useMemo(() =>
      data?.[resultsFieldName]?.edges || [],
    [data, resultsFieldName]);
  const slicedResults = React.useMemo(() => {
    return results.slice(page * pageLimit, page * pageLimit + pageLimit);
  }, [page, results, pageLimit]);
  const hasNextResults = React.useMemo(
    () => data?.[resultsFieldName].pageInfo.hasNextPage,
    [data, resultsFieldName]);
  const lastPage = React.useMemo(
    () => Math.ceil((results.length / pageLimit)) - 1,
    [results, pageLimit]);

  const previousPage = React.useCallback(
    () => setPage((oldPage) => oldPage - 1),
    [setPage]);
  const nextPage = React.useCallback(
    async () => {
      if (page === lastPage) {
        await fetchMore({
          variables: {
            cursor: results[results.length - 1].cursor
          }
        });
      }
      setPage((oldPage) => oldPage + 1);
    },
    [page, setPage, lastPage]);

  return {
    [resultsFieldName]: slicedResults,
    hasNextPage: hasNextResults || page < lastPage,
    hasPreviousPage: page > 0,
    nextPage,
    previousPage,
    loading,
  };
};
