import { Badge } from "@shopify/polaris";
import React from "react";

const TranslationProgressBadge = ({
  locale, translationsCount, expectedTranslationsCount
}) => {
  let status = "critical";
  if (translationsCount === expectedTranslationsCount) {
    status = "success";
  } else if (translationsCount > 0) {
    status = "warning";
  }
  return (
    <Badge status={status}>{locale.code}</Badge>
  );
};

export default TranslationProgressBadge;
