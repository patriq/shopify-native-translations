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
import { PRODUCT_FIELDS } from "../../constants/translatableContents";
import { useShopLocales } from "../../context/ShopLocales";
import { translationsCount, translationsSubQueries } from "../../util/utils";

const productsWithTranslations = (locales) => gql`
  query ($limit: Int!, $cursor: String) {
    products(first: $limit, after: $cursor) {
      edges {
        node {
          id
          handle
          title
          featuredImage {
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

const Products = () => {
  const router = useRouter();
  const { secondaryLocales, loadingLocales } = useShopLocales();
  const { data, loading, fetchMore } = useQuery(
    productsWithTranslations(secondaryLocales),
    {
      notifyOnNetworkStatusChange: true,
      variables: { limit: 10 },
      skip: loadingLocales
    });

  const products = React.useMemo(
    () => data?.products.edges || [], [data]);
  const hasNextPage = React.useMemo(
    () => data?.products.pageInfo.hasNextPage, [data]);

  const handleNext = React.useCallback(() =>
    fetchMore({
      variables: {
        cursor: products[products.length - 1].cursor
      }
    }), [fetchMore, products]);

  return (
    <Page
      title="Products"
      breadcrumbs={[{
        content: "Home",
        onAction: () => router.push("/")
      }]}
    >
      <Card>
        <ResourceList
          items={products}
          loading={loading || loadingLocales}
          renderItem={({ node }) =>
            <ResourceItem
              id={node.id}
              media={
                <Thumbnail
                  size="small"
                  source={node.featuredImage ? node.featuredImage.url : ImageMajor}
                  alt={node.title}
                />
              }
              verticalAlignment="center"
              onClick={() => router.push(`/products/${node.handle}`)}
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
                    expectedTranslationsCount={Object.keys(PRODUCT_FIELDS).length}
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

export default Products;
