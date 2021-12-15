import {
  Button,
  ButtonGroup,
  Card,
  Modal,
  Page,
  ResourceItem,
  ResourceList,
  Select,
  Spinner,
  Stack,
  TextStyle,
  Icon
} from "@shopify/polaris";
import { DeleteMinor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import React from "react";
import { SHOP_LOCALES } from "../constants/locales";
import {
  useDisableLocaleMutation,
  useEnableLocaleMutation,
  useShopLocales,
  useUpdateLocaleMutation
} from "../context/ShopLocales";

const OPTIONS = Object.entries(SHOP_LOCALES).map(([key, value]) => ({
  label: value,
  value: key
}));

const AddLocaleModal = ({ open, setOpen }) => {
  const initialRender = React.useRef(true);
  const [value, setValue] = React.useState(OPTIONS[0].value);
  const [enableLocale, { loading }] = useEnableLocaleMutation();

  // Close after loading stops
  React.useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (!loading) {
      setOpen(false);
    }
  }, [setOpen, loading]);

  // Clear if not open
  React.useEffect(() => {
    if (!open) {
      setValue(OPTIONS[0].value);
    }
  }, [open, setValue]);

  if (!open) {
    return null;
  }
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Add locale"
      primaryAction={{
        content: "Add locale",
        onAction: () => {
          enableLocale({ variables: { locale: value } });
        },
        loading
      }}
      secondaryActions={[{
        content: "Cancel",
        onAction: () => setOpen(false)
      }]}
    >
      <Modal.Section>
        <Select
          label="Locale"
          options={OPTIONS}
          value={value}
          onChange={setValue}
          autoComplete="off"
        />
      </Modal.Section>
    </Modal>
  );
};

const RemoveLocaleModal = ({ locale }) => {
  const initialRender = React.useRef(true);
  const [open, setOpen] = React.useState(false);
  const [disableLocale, { loading }] = useDisableLocaleMutation();

  // Close after loading stops
  React.useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (!loading) {
      setOpen(false);
    }
  }, [setOpen, loading]);

  const deleteButton = (
    <Button
      size="slim"
      onClick={() => setOpen(true)}
    >
      <Icon source={DeleteMinor} />
    </Button>
  );
  return (
    <Modal
      open={open}
      activator={deleteButton}
      onClose={() => setOpen(false)}
      title={`Remove ${locale.name}?`}
      primaryAction={{
        content: "Remove ",
        onAction: () => {
          disableLocale({ variables: { locale: locale.locale } });
        },
        loading,
        destructive: true
      }}
      secondaryActions={[{
        content: "Cancel",
        onAction: () => setOpen(false)
      }]}
    >
      <Modal.Section>
        Do you really want to remove the
        <TextStyle variation="strong"> {locale.name} </TextStyle>
        locale?
      </Modal.Section>
    </Modal>
  );
};

const TogglePublishButton = ({ published, locale }) => {
  const [updateLocale, { loading }] = useUpdateLocaleMutation();

  return (
    <Button
      size="slim"
      loading={loading}
      onClick={() => {
        updateLocale({
          variables: {
            locale: locale.locale,
            shopLocale: { published: !published }
          }
        });
      }}
    >
      {published ? "Unpublish" : "Publish"}
    </Button>
  );
};

const Locales = () => {
  const router = useRouter();
  const [isAddLocaleOpen, setAddLocaleOpen] = React.useState(false);
  const { primaryLocale, secondaryLocales, loadingLocales } = useShopLocales();

  return (
    <>
      <Page
        title="Shop locale settings"
        breadcrumbs={[{
          content: "Home",
          onAction: () => router.push("/")
        }]}
      >
        {/* Default locale */}
        <Card title="Default locale" sectioned>
          {loadingLocales && <Spinner size="small" />}
          {primaryLocale && primaryLocale.name}
        </Card>

        {/* Translated locales */}
        <Card
          title="Translated locales"
          actions={[{
            content: "Add locale",
            onAction: () => setAddLocaleOpen(true)
          }]}
        >
          <Card.Section>
            These languages are the ones you can translate content to.
          </Card.Section>
          <ResourceList
            loading={loadingLocales}
            items={secondaryLocales}
            renderItem={(item) => {
              const { locale, name, published } = item;
              return (
                <ResourceItem id={locale}>
                  <Stack>
                    <Stack.Item fill>
                      <TextStyle variation="strong">{name}</TextStyle>
                    </Stack.Item>
                    <ButtonGroup segmented>
                      <TogglePublishButton
                        locale={item}
                        published={published}
                      />
                      {!published && <RemoveLocaleModal locale={item} />}
                    </ButtonGroup>
                  </Stack>
                </ResourceItem>
              );
            }}
          />
        </Card>
      </Page>
      <AddLocaleModal open={isAddLocaleOpen} setOpen={setAddLocaleOpen} />
    </>
  );
};

export default Locales;
