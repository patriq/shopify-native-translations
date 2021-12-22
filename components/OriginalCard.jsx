import { Card, FormLayout, Select, SkeletonBodyText } from "@shopify/polaris";
import React from "react";
import { useShopLocales } from "../context/ShopLocales";
import TranslatableTextField from "./TranslatableTextField";

const OriginalCard = ({ translatableResources, loadingTranslations }) => {
  const { primaryLocale } = useShopLocales();

  const translationFields = React.useMemo(() => {
    const fields = [];
    const duplicateLabelSet = new Set();
    for (const resource of translatableResources) {
      for (const content of resource.translatableContent) {
        if (!duplicateLabelSet.has(content.label)) {
          duplicateLabelSet.add(content.label);
          fields.push(
            <TranslatableTextField
              key={content.label}
              translatableContent={content}
            />
          );
        }
      }
    }
    return fields;
  }, [translatableResources]);

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
          {!loadingTranslations && translationFields}
        </FormLayout>
      </Card.Section>
    </Card>
  );
};

export default OriginalCard;
