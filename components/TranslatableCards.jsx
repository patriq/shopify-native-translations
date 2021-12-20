import { gql, useQuery } from "@apollo/client";
import { Layout } from "@shopify/polaris";
import React from "react";
import { useShopLocales } from "../context/ShopLocales";
import { translationsSubQueries } from "../util/utils";
import OriginalCard from "./OriginalCard";
import TranslationCard from "./TranslationCard";

const getTranslatableResourcesByIdsQuery = (locales) => gql`
  query ($limit: Int!, $ids: [ID!]!) {
    translatableResourcesByIds(first: $limit, resourceIds: $ids) {
      edges {
        node {
          resourceId
          translatableContent {
            key
            value
            digest
            locale
          }
          ${translationsSubQueries(locales)}
        }
      }
    }
  }
`;

const TranslatableCards = ({ resources }) => {
  const { secondaryLocales, loadingLocales } = useShopLocales();
  const { data, loading, refetch } = useQuery(
    getTranslatableResourcesByIdsQuery(secondaryLocales),
    {
      variables: {
        limit: Object.keys(resources).length,
        ids: Object.keys(resources)
      },
      skip: loadingLocales
    });

  // Label and filter the relevant fields
  const translatableResources = React.useMemo(() => {
    const edges = data?.translatableResourcesByIds?.edges || [];
    return edges.map(({ node }) => ({
      ...node,
      translatableContent: node.translatableContent
        .map((field) => ({
          ...field,
          label: resources[node.resourceId][field.key]
        }))
        .filter((field) => field.label),
    }));
  }, [resources, data]);

  if (loadingLocales) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section oneHalf>
        <OriginalCard
          translatableResources={translatableResources}
          loadingTranslations={loading}
        />
      </Layout.Section>
      <Layout.Section oneHalf>
        <TranslationCard
          translatableResources={translatableResources}
          loadingTranslations={loading}
          refetchTranslations={refetch}
        />
      </Layout.Section>
    </Layout>
  );
};

export default TranslatableCards;
