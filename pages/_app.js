import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import { Provider as AppBridgeProvider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import ShopLocalesProvider from "../context/ShopLocales";

// Based on https://github.com/kinngh/shopify-node-mongodb-next-app/blob/main/pages/_app.js.

const CustomApolloProvider = ({ Component, ...props }) => {
  const app = useAppBridge();

  const client = new ApolloClient({
    link: createHttpLink({
      fetch: authenticatedFetch(app),
      headers: {
        "Content-Type": "application/graphql",
      },
      credentials: "include"
    }),
    cache: new InMemoryCache({
      typePolicies: {
        // Collection, Product and Metafields automatically cached since they
        // have an id field.
        TranslatableResource: {
          keyFields: ["resourceId"],
        },
        Query: {
          fields: {
            // Used in collections.js
            collections: relayStylePagination(),
            // Used in products.js
            products: relayStylePagination(),
          },
        },
      },
    })
  });

  return (
    <ApolloProvider client={client}>
      <ShopLocalesProvider>
        <Component {...props} />
      </ShopLocalesProvider>
    </ApolloProvider>
  );
};

const CustomApp = ({ Component, pageProps, host }) => {
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider
        config={{
          apiKey: API_KEY,
          host: host,
          forceRedirect: true
        }}
      >
        <CustomApolloProvider Component={Component} {...pageProps} />
      </AppBridgeProvider>
    </PolarisProvider>
  );
};

CustomApp.getInitialProps = async (context) => {
  return {
    host: context.ctx.query.host,
    shop: context.ctx.query.shop
  };
}

export default CustomApp;
