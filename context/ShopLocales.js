import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { SHOP_LOCALES } from "../constants/locales";

const GET_SHOP_LOCALES = gql`{
  shopLocales {
    locale
    primary
    published
  }
}`;

const ENABLE_LOCALE = gql`
  mutation enableLocale($localeCode: String!) {
    shopLocaleEnable(locale: $localeCode) {
      userErrors {
        message
        field
      }
      shopLocale {
        locale
        name
        primary
        published
      }
    }
  }
`;

const DISABLE_LOCALE = gql`
  mutation disableLocale($localeCode: String!) {
    shopLocaleDisable(locale: $localeCode) {
      userErrors {
        message
        field
      }
      locale
    }
  }
`;

const UPDATE_LOCALE = gql`
  mutation updateLocale($localeCode: String!, $shopLocale: ShopLocaleInput!) {
    shopLocaleUpdate(locale: $localeCode, shopLocale: $shopLocale) {
      userErrors {
        message
        field
      }
      shopLocale {
        name
        locale
        primary
        published
      }
    }
  }
`;

const ShopLocalesContext = React.createContext(null);

export const useShopLocales = () => {
  const locales = React.useContext(ShopLocalesContext);
  if (!locales) {
    throw new Error("You must useShopLocales inside ShopLocalesProvider.");
  }
  return locales;
};

export const useEnableLocaleMutation = () => {
  return useMutation(ENABLE_LOCALE, {
    refetchQueries: [GET_SHOP_LOCALES],
    awaitRefetchQueries: true
  });
};

export const useDisableLocaleMutation = () => {
  return useMutation(DISABLE_LOCALE, {
    refetchQueries: [GET_SHOP_LOCALES],
    awaitRefetchQueries: true
  });
};

export const useUpdateLocaleMutation = () => {
  return useMutation(UPDATE_LOCALE, {
    refetchQueries: [GET_SHOP_LOCALES],
    awaitRefetchQueries: true
  });
};

const useShopLocalesContext = () => {
  const { loading, data } = useQuery(GET_SHOP_LOCALES);

  const locales = React.useMemo(() => {
    const locales = data?.shopLocales || [];
    return locales.map(({ locale, primary, published }) => ({
      code: locale,
      name: SHOP_LOCALES[locale],
      primary,
      published
    }));
  }, [data]);
  const primaryLocale = React.useMemo(() =>
    locales.find((locale) => locale.primary), [locales]);
  const secondaryLocales = React.useMemo(() =>
    locales.filter((locale) => !locale.primary), [locales]);

  return {
    loadingLocales: loading,
    primaryLocale,
    secondaryLocales
  };
};

const ShopLocalesProvider = ({ children }) => {
  const value = useShopLocalesContext();

  return (
    <ShopLocalesContext.Provider value={value}>
      {children}
    </ShopLocalesContext.Provider>
  );
};

export default ShopLocalesProvider;
