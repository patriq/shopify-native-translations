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
import { translationsCount, translationsSubQueries, usePaginatedQuery } from "../../util/utils";

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
  const {
    collections, loading,
    nextPage, previousPage, hasPreviousPage, hasNextPage
  } = usePaginatedQuery(
    collectionWithTranslations(secondaryLocales), 50, "collections", {
      skip: loadingLocales
    });

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
                  size="small"
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
          <Pagination
            hasPrevious={hasPreviousPage}
            hasNext={hasNextPage}
            onNext={nextPage}
            onPrevious={previousPage}
          />
        </Card.Section>
      </Card>
    </Page>
  );
};

export default Collections;
