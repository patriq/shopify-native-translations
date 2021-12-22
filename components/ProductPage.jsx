import { Page, Thumbnail } from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import React from "react";
import { BLOCKED_VARIANT_OPTION_NAMES, METAFIELD_KEY_LABELS } from "../constants/settings";
import {
  METAFIELD_VALUE_FIELD,
  PRODUCT_FIELDS,
  VARIANT_OPTION_FIELD
} from "../constants/translatableContents";
import TranslatableCards from "./TranslatableCards";

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

  const variantsResources = React.useMemo(() => {
    const result = {};
    product?.variants?.edges?.forEach(({ node }) => {
      result[node.id] = {};
      product?.options.forEach(({ name, position }) => {
        if (BLOCKED_VARIANT_OPTION_NAMES.includes(name)) {
          return;
        }
        result[node.id][VARIANT_OPTION_FIELD(position)] =
          `${name} (${node.selectedOptions.find((option) =>
            option.name === name).value})`;
      });
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
          ...metafieldsResources,
          ...variantsResources
        }}
      />
    </Page>
  );
};

export default ProductPage;
