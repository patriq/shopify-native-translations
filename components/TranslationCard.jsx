import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Card, FormLayout, Select, SkeletonBodyText } from "@shopify/polaris";
import React from "react";
import { useShopLocales } from "../context/ShopLocales";
import {
  findResourceCacheIdsWithTranslations,
  translationValue,
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
          value: translationValue(resource, locale.code, content.key),
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

  const setTranslations = React.useCallback(
    (resourceIds, contentKey, value) =>
      setState((oldState) => {
        let changed = false;
        const newState = { ...oldState };
        for (const resourceId of resourceIds) {
          if (!oldState[resourceId]) {
            continue;
          }
          changed = true;
          newState[resourceId][contentKey].value = value || undefined;
        }
        if (!changed) {
          return oldState;
        }
        return newState;
      }), [setState]);

  const getCreateMutationPayloads = React.useCallback(() =>
    Object.entries(state)
      // Filter resources that have a different translation than the one fetched
      // This way we only send a request if any field of the resource was
      // changed, saving bandwidth and quota in the process
      .filter(([resourceId, translations]) => {
        const resource = translatableResources.find(
          (resource) => resource.resourceId === resourceId);
        for (const [contentKey, translation] of Object.entries(translations)) {
          if (translation.value === undefined) {
            continue;
          }
          // Compare the value in the state with the original value
          if (translation.value !==
            translationValue(resource, locale.code, contentKey)) {
            return true;
          }
        }
        return false;
      })
      // Map each resource to a variables payload
      .map(([resourceId, translations]) => ({
        id: resourceId,
        translations: Object.entries(translations)
          // Only include the translations that have a value
          .filter(([, translation]) => translation.value !== undefined)
          .map(([contentKey, translation]) => ({
            key: contentKey,
            value: translation.value,
            locale: locale.code,
            translatableContentDigest: translation.digest
          }))
      })), [translatableResources, state, locale]);

  const getRemoveMutationPayloads = React.useCallback(() =>
    // Map each to a variables payload
    Object.entries(state).map(([resourceId, translations]) => ({
      id: resourceId,
      keys: Object.keys(translations),
      locales: [locale.code]
    })), [state, locale]);

  return [
    getTranslation, setTranslations, hasTranslations,
    getCreateMutationPayloads, getRemoveMutationPayloads
  ];
};

const handleTranslationsMutation = async (
  apolloClient, locale,
  mutation, payloadFactory, setLoader
) => {
  setLoader(true);
  const idsWithResults = await Promise.all(
    payloadFactory().map(async (payload) =>
      [payload.id, await mutation({ variables: payload })]));
  for (const [id, result] of idsWithResults) {
    // Change each cache item related to the resource that was updated.
    const cacheIds = findResourceCacheIdsWithTranslations(
      apolloClient, id, locale.code);
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
  }
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
    getTranslation, setTranslations, hasTranslations,
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

  const translationFields = React.useMemo(() => {
    const fields = [];
    const duplicateLabelsMap = new Map();
    for (const resource of translatableResources) {
      for (const content of resource.translatableContent) {
        // Collect all duplicate label resource IDs, so we can change them all
        // to the same value.
        if (!duplicateLabelsMap.has(content.label)) {
          duplicateLabelsMap.set(content.label, [resource.resourceId]);
          fields.push(
            <TranslatableTextField
              key={content.label}
              translatableContent={content}
              value={getTranslation(resource.resourceId, content.key)}
              onChange={(value) => {
                setTranslations(
                  duplicateLabelsMap.get(content.label), content.key, value);
              }}
            />
          );
        } else {
          duplicateLabelsMap.get(content.label).push(resource.resourceId);
        }
      }
    }
    return fields;
  }, [getTranslation, setTranslations, translatableResources]);

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
          {!loadingTranslations && translationFields}
        </FormLayout>
      </Card.Section>
    </Card>
  );
};

export default TranslationCard;
