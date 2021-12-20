# Shopify Native Translations

An open-source Shopify App, that will allow you to translate Collections, Products and their Metafields using [Shopify's GraphQL Admin Translations API](https://shopify.dev/api/examples/i18n-app-translations).

This app was bootstraped with [Shopify CLI](https://github.com/Shopify/shopify-cli) and made with Node, [Next.js](https://nextjs.org/), [Shopify-koa-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth), [Polaris](https://github.com/Shopify/polaris-react), and [App Bridge React](https://shopify.dev/tools/app-bridge/react-components).

## Installation

1. Fork this repository.
2. Change to its directory and run `shopify node create -n YOUR_APP_NAME`
3. Make sure to update the `SCOPES` variable in your `.env` file to match the ones in the `.env.example` file.
4. You can now use `shopify app serve` to debug your app.

## Deployment

I have only experimented deploying with [Heroku](https://heroku.com). To deploy in Heroku:

1. Create a new app in Heroku.
2. Connect your forked repository to your Heroku app.
3. In your app settings, add all your environment variables in the Config Vars section.
4. In the Deploy tab, deploy the `main` branch.
5. Update the URL of your Shopify App.

## License

This respository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
