import { TextField } from "@shopify/polaris";
import React from "react";

const TranslatableTextField = ({ translatableContent, onChange, value }) => {
  return (
    <TextField
      label={translatableContent.label}
      value={value === undefined ? translatableContent.value : value}
      disabled={!onChange}
      onChange={onChange}
      multiline={translatableContent.key.includes("html") ? 5 : false}
    />
  );
};

export default TranslatableTextField;
