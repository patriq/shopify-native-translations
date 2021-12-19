import { Card, FormLayout, Select, SkeletonBodyText } from "@shopify/polaris";
import React from "react";
import { useShopLocales } from "../context/ShopLocales";
import TranslatableTextField from "./TranslatableTextField";

const OriginalCard = ({ translatableResources, loadingTranslations }) => {
  const { primaryLocale } = useShopLocales();

  return (
    <Card title={`${primaryLocale.name} (default)`}>
      <Card.Section>
        <Select
          label=""
          labelHidden
          placeholder={primaryLocale.name}
          autoComplete="off"
          disabled
        />
      </Card.Section>
      <Card.Section title="Original">
        {loadingTranslations && <SkeletonBodyText />}
        <FormLayout>
          {!loadingTranslations &&
            translatableResources.map((resource) =>
              resource.translatableContent.map((content) =>
                <TranslatableTextField
                  key={resource.resourceId + content.key}
                  translatableContentKey={content.key}
                  value={content.value}
                />))}
        </FormLayout>
      </Card.Section>
    </Card>
  );
};

export default OriginalCard;
