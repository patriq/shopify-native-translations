import { TextField } from "@shopify/polaris";
import React from "react";
import { COLLECTION_FIELDS } from "../constants/translatableContents";

const TranslatableTextField = ({ translatableContentKey, onChange, value }) => {
  return (
    <TextField
      label={COLLECTION_FIELDS[translatableContentKey]}
      value={value}
      disabled={!onChange}
      onChange={onChange}
      multiline={translatableContentKey.includes("html") ? 5 : false}
    />
  );
};

export default TranslatableTextField;
