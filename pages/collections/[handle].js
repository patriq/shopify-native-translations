import { gql, useQuery } from "@apollo/client";
import { Page, SkeletonPage, Thumbnail } from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import React from "react";
import TranslatableCards from "../../components/TranslatableCards";
import { COLLECTION_FIELDS } from "../../constants/translatableContents";

const GET_COLLECTION_BY_HANDLE_QUERY = gql`
  query ($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      descriptionHtml
      image {
        url
      }
    }
  }
`;

const Collection = () => {
  const router = useRouter();
  const { handle } = router.query;
  const { data, loading } = useQuery(GET_COLLECTION_BY_HANDLE_QUERY, {
    variables: { handle }
  });

  const collection = React.useMemo(() =>
    data?.collectionByHandle, [data]);

  if (loading || !collection) {
    return <SkeletonPage breadcrumbs />;
  }
  return (
    <Page
      title={collection.title}
      thumbnail={
        <Thumbnail
          source={collection.image ? collection.image.url : ImageMajor}
          alt={collection.title}
        />
      }
      breadcrumbs={[{
        content: "Home",
        onAction: () => router.push("/collections")
      }]}
    >
      <TranslatableCards
        resources={{
          [collection.id]: Object.keys(COLLECTION_FIELDS),
          "gid://shopify/Collection/278337814698": Object.keys(COLLECTION_FIELDS),
        }}
      />
    </Page>
  );
};

export default Collection;
