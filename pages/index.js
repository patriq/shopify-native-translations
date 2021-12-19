import { Page, List } from "@shopify/polaris";
import Link from "next/link";

const Index = () => (
  <Page>
    <List>
      <List.Item>
        <Link href="/collections">Collections</Link>
      </List.Item>
      <List.Item>
        <Link href="/locales">Shop locale settings</Link>
      </List.Item>
    </List>
  </Page>
);

export default Index;
