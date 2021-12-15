import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { Provider as AppBridgeProvider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";

const userLoggedInFetch = (app) => {
  const fetchFunction = authenticatedFetch(app);
  return async (uri, options) => {
    const response = await fetchFunction(uri, options);
    if (response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url");
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }
    return response;
  };
};

const CustomApolloProvider = ({ Component, ...props }) => {
  const app = useAppBridge();

  const client = new ApolloClient({
    link: new HttpLink({
      fetch: userLoggedInFetch(app),
      fetchOptions: {
        credentials: "include"
      }
    }),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <Component {...props} />
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

CustomApp.getInitialProps = async ({ ctx }) => ({
  host: ctx.query.host
});

export default CustomApp;
