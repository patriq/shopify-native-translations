import { gql, useQuery } from "@apollo/client";
import { Page, SkeletonPage, Thumbnail } from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import React from "react";
import TranslatableCards from "./TranslatableCards";
import { METAFIELD_KEY_LABELS } from "../constants/settings";
import { METAFIELD_VALUE_FIELD, PRODUCT_FIELDS } from "../constants/translatableContents";

const ProductPage = ({ product, onBack }) => {
  const metafieldsResources = React.useMemo(() => {
    const result = {};
    product?.metafields?.edges?.forEach(({ node }) => {
      result[node.id] = {
        [METAFIELD_VALUE_FIELD]: METAFIELD_KEY_LABELS[node.key]
      };
    });
    return result;
  }, [product]);

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
        onAction: onBack
      }]}
    >
      <TranslatableCards
        resources={{
          [product.id]: PRODUCT_FIELDS,
          ...metafieldsResources
        }}
      />
    </Page>
  );
};

export default ProductPage;
