import { gql, useQuery } from "@apollo/client";
import {
  Card,
  Page,
  Pagination,
  ResourceItem,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import React from "react";
import TranslationProgressBadge from "../../components/TranslationProgressBadge";
import { COLLECTION_FIELDS } from "../../constants/translatableContents";
import { useShopLocales } from "../../context/ShopLocales";
import { translationsCount, translationsSubQueries } from "../../util/utils";

const collectionWithTranslations = (locales) => gql`
  query ($limit: Int!, $cursor: String) {
    collections(first: $limit, after: $cursor) {
      edges {
        node {
          id
          handle
          title
          image {
            url
          }
          ${translationsSubQueries(locales)}
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const Collections = () => {
  const router = useRouter();
  const { secondaryLocales, loadingLocales } = useShopLocales();
  const { data, loading, fetchMore } = useQuery(
    collectionWithTranslations(secondaryLocales),
    {
      notifyOnNetworkStatusChange: true,
      variables: { limit: 10 },
      skip: loadingLocales
    });

  const collections = React.useMemo(
    () => data?.collections.edges || [], [data]);
  const hasNextPage = React.useMemo(
    () => data?.collections.pageInfo.hasNextPage, [data]);

  const handleNext = React.useCallback(() =>
    fetchMore({
      variables: {
        cursor: collections[collections.length - 1].cursor
      }
    }), [fetchMore, collections]);

  return (
    <Page
      title="Collections"
      breadcrumbs={[{
        content: "Home",
        onAction: () => router.push("/")
      }]}
    >
      <Card>
        <ResourceList
          items={collections}
          loading={loading || loadingLocales}
          renderItem={({ node }) =>
            <ResourceItem
              id={node.id}
              media={
                <Thumbnail
                  size="large"
                  source={node.image ? node.image.url : ImageMajor}
                  alt={node.title}
                />
              }
              verticalAlignment="center"
              onClick={() => router.push(`/collections/${node.handle}`)}
            >
              <Stack>
                <Stack.Item fill>
                  <TextStyle>{node.title}</TextStyle>
                </Stack.Item>
                {secondaryLocales.map((locale) =>
                  <TranslationProgressBadge
                    key={locale.code}
                    locale={locale}
                    translationsCount={translationsCount(node, locale.code)}
                    expectedTranslationsCount={Object.keys(COLLECTION_FIELDS).length}
                  />)}
              </Stack>
            </ResourceItem>
          }
        />
        <Card.Section>
          <Pagination hasNext={hasNextPage} onNext={handleNext} />
        </Card.Section>
      </Card>
    </Page>
  );
};

export default Collections;
