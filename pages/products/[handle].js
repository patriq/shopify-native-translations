import { gql, useQuery } from "@apollo/client";
import { Page, SkeletonPage, Thumbnail } from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import React from "react";
import TranslatableCards from "../../components/TranslatableCards";
import { METAFIELD_KEY_LABELS, PRODUCT_METAFIELDS_LIMIT } from "../../constants/settings";
import { METAFIELD_VALUE_FIELD, PRODUCT_FIELDS } from "../../constants/translatableContents";

const GET_PRODUCT_BY_HANDLE_QUERY = gql`
  query ($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      descriptionHtml
      featuredImage {
        url
      }
      metafields(first: ${PRODUCT_METAFIELDS_LIMIT}) {
        edges {
          node {
            id
            key
          }
        }
      }
    }
  }
`;

const Product = () => {
  const router = useRouter();
  const { handle } = router.query;
  const { data, loading } = useQuery(GET_PRODUCT_BY_HANDLE_QUERY, {
    variables: { handle }
  });

  const product = React.useMemo(() =>
    data?.productByHandle, [data]);
  const metafields = React.useMemo(() => {
    const result = {};
    product?.metafields?.edges?.forEach(({ node }) => {
      result[node.id] = {
        [METAFIELD_VALUE_FIELD]: METAFIELD_KEY_LABELS[node.key]
      };
    });
    return result;
  }, [product]);
  console.log(metafields);

  if (loading || !product) {
    return <SkeletonPage breadcrumbs />;
  }
  return (
    <Page
      title={product.title}
      thumbnail={
        <Thumbnail
          source={product.featuredImage ? product.featuredImage.url : ImageMajor}
          alt={product.title}
        />
      }
      breadcrumbs={[{
        content: "Home",
        onAction: () => router.push("/products")
      }]}
    >
      <TranslatableCards
        resources={{
          [product.id]: PRODUCT_FIELDS,
          ...metafields
        }}
      />
    </Page>
  );
};

export default Product;
