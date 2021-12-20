import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Card, FormLayout, Select, SkeletonBodyText } from "@shopify/polaris";
import React from "react";
import { useShopLocales } from "../context/ShopLocales";
import {
  findResourceCacheIdsWithTranslations,
  translation,
  translationsCacheFieldKey,
  translationsCount
} from "../util/utils";
import TranslatableTextField from "./TranslatableTextField";

const CREATE_TRANSLATION_MUTATION = gql`
  mutation CreateTranslation($id: ID!, $translations: [TranslationInput!]!) {
    translationsRegister(resourceId: $id, translations: $translations) {
      userErrors {
        message
        field
      }
      translations {
        locale
        key
        value
      }
    }
  }
`;

const REMOVE_TRANSLATIONS_MUTATION = gql`
  mutation RemoveTranslations($id: ID!, $keys: [String!]!, $locales: [String!]!) {
    translationsRemove(
      resourceId: $id,
      translationKeys: $keys,
      locales: $locales
    ) {
      userErrors {
        message
        field
      }
      translations {
        locale
        key
        value
      }
    }
  }
`;

const useTranslationLocaleSelect = () => {
  const [selectedLocaleIndex, setSelectedLocaleIndex] = React.useState("0");
  const { secondaryLocales } = useShopLocales();

  const options = React.useMemo(() => secondaryLocales
    .map((locale, index) => ({ label: locale.name, value: `${index}` })), [secondaryLocales]);
  const handleSelectChange = React.useCallback((value) => setSelectedLocaleIndex(value), [setSelectedLocaleIndex]);
  const selectedLocale = React.useMemo(() => secondaryLocales[Number.parseInt(selectedLocaleIndex, 10)], [secondaryLocales, selectedLocaleIndex]);
  const selectComponent = React.useMemo(() => {
    return (<Select
      label=""
      labelHidden
      options={options}
      value={selectedLocaleIndex}
      onChange={handleSelectChange}
      autoComplete="off"
    />);
  }, [options, selectedLocaleIndex, handleSelectChange]);

  return [selectedLocale, selectComponent];
};

const useTranslationsState = (translatableResources, locale) => {
  const initialState = React.useCallback((translatableResources, locale) => {
    const state = {};
    translatableResources.forEach((resource) => {
      const id = resource.resourceId;
      state[id] = {};
      resource.translatableContent.forEach((content) => {
        state[id][content.key] = {
          value: translation(resource, locale.code, content.key),
          digest: content.digest
        };
      });
    });
    return state;
  }, []);
  const [state, setState] = React.useState({});

  // Reset state when the locale or the resource changes
  React.useEffect(() => {
    setState(initialState(translatableResources, locale));
  }, [translatableResources, locale]);

  const hasTranslations = React.useCallback(() =>
      Object.values(state).some((resource) =>
        Object.values(resource).some((translation) => translation.value)),
    [state]);
  const getTranslation = React.useCallback((resourceId, contentKey) => {
    if (!state[resourceId]) {
      return "";
    }
    return state[resourceId][contentKey].value || "";
  }, [state]);
  const setTranslation = React.useCallback(
    (resourceId, contentKey, value) =>
      setState((oldState) => {
        if (!oldState[resourceId]) {
          return oldState;
        }
        const newState = { ...oldState };
        newState[resourceId][contentKey].value = value || undefined;
        return newState;
      }), [setState]);
  const getCreateMutationPayloads = React.useCallback(() =>
    Object.entries(state)
      // Filter resources that have updated translations
      .filter(([, translations]) =>
        Object.values(translations).some((translation) => translation.value))
      // Map each to a variables payload
      .map(([resourceId, translations]) => ({
        id: resourceId,
        translations: Object.entries(translations)
          // Filter those who actually have a value
          .filter(([, translation]) => translation.value)
          .map(([contentKey, translation]) => ({
            key: contentKey,
            value: translation.value,
            locale: locale.code,
            translatableContentDigest: translation.digest
          }))
      })), [state, locale]);
  const getRemoveMutationPayloads = React.useCallback(() =>
    // Map each to a variables payload
    Object.entries(state).map(([resourceId, translations]) => ({
      id: resourceId,
      keys: Object.keys(translations),
      locales: [locale.code]
    })), [state, locale]);
  return [
    getTranslation, setTranslation, hasTranslations,
    getCreateMutationPayloads, getRemoveMutationPayloads
  ];
};

const handleTranslationsMutation = async (
  apolloClient, locale,
  mutation, payloadFactory, setLoader
) => {
  setLoader(true);
  await Promise.all(
    payloadFactory().map(async (payload) => {
      const result = await mutation({ variables: payload });
      // Change each cache item related to the resource that was updated.
      const cacheIds = findResourceCacheIdsWithTranslations(
        apolloClient, payload.id, locale.code);
      cacheIds.forEach((cacheId) => {
        apolloClient.cache.modify({
          id: cacheId,
          fields: {
            [translationsCacheFieldKey(locale.code)]: () => {
              // translationsRemove contains the removed translations.
              if (result.data.translationsRemove) {
                return [];
              }
              // translationsRegister contains the added translations.
              return result.data.translationsRegister.translations;
            }
          }
        });
      });
    }));
  setLoader(false);
};

const TranslationCard = ({
  translatableResources,
  loadingTranslations
}) => {
  const client = useApolloClient();
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [selectedLocale, selectComponent] = useTranslationLocaleSelect();
  const [
    getTranslation, setTranslation, hasTranslations,
    getCreateMutationPayloads, getRemoveMutationPayloads] =
    useTranslationsState(translatableResources, selectedLocale);
  const [createTranslation] = useMutation(CREATE_TRANSLATION_MUTATION);
  const [removeTranslation] = useMutation(REMOVE_TRANSLATIONS_MUTATION);

  // Disable remove if there are no translations to remove
  const disabledRemove = React.useMemo(() =>
      translatableResources.every((resource) =>
        translationsCount(resource, selectedLocale.code) === 0),
    [selectedLocale, translatableResources]);

  const handleSave = React.useCallback(() =>
      handleTranslationsMutation(
        client, selectedLocale,
        createTranslation,
        getCreateMutationPayloads,
        setSaving),
    [client, selectedLocale,
      createTranslation, getCreateMutationPayloads, setSaving]);

  const handleRemove = React.useCallback(async () =>
      handleTranslationsMutation(
        client, selectedLocale,
        removeTranslation,
        getRemoveMutationPayloads,
        setDeleting),
    [client, selectedLocale,
      removeTranslation, getRemoveMutationPayloads, setDeleting]);

  return (
    <Card
      title={`${selectedLocale.name}`}
      secondaryFooterActions={[{
        content: "Delete translations",
        destructive: true,
        disabled: disabledRemove,
        loading: deleting,
        onAction: handleRemove
      }]}
      primaryFooterAction={{
        content: "Save",
        disabled: !hasTranslations(),
        loading: saving,
        onAction: handleSave
      }}
    >
      <Card.Section>{selectComponent}</Card.Section>
      <Card.Section title="Translation">
        {loadingTranslations && <SkeletonBodyText />}
        <FormLayout>
          {!loadingTranslations &&
            translatableResources.map((resource) =>
              resource.translatableContent.map((content) =>
                <TranslatableTextField
                  key={content.digest}
                  translatableContent={content}
                  value={getTranslation(resource.resourceId, content.key)}
                  onChange={(value) =>
                    setTranslation(resource.resourceId, content.key, value)}
                />))}
        </FormLayout>
      </Card.Section>
    </Card>
  );
};

export default TranslationCard;
