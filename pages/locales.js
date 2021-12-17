import {
  Button,
  ButtonGroup,
  Card,
  Icon,
  Modal,
  Page,
  ResourceItem,
  ResourceList,
  Select,
  Spinner,
  Stack,
  TextStyle
} from "@shopify/polaris";
import { DeleteMinor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import React from "react";
import { SHOP_LOCALE_OPTIONS } from "../constants/locales";
import {
  useDisableLocaleMutation,
  useEnableLocaleMutation,
  useShopLocales,
  useUpdateLocaleMutation
} from "../context/ShopLocales";

const AddLocaleModal = ({ open, setOpen }) => {
  const initialRender = React.useRef(true);
  const [localeCode, setLocaleCode] = React.useState(SHOP_LOCALE_OPTIONS[0].value);
  const [enableLocale, { loading }] = useEnableLocaleMutation();

  const handleAdd = React.useCallback(() =>
    enableLocale({ variables: { localeCode } }), [enableLocale, localeCode]);

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

  // Reset to default if not open
  React.useEffect(() => {
    if (!open) {
      setLocaleCode(SHOP_LOCALE_OPTIONS[0].value);
    }
  }, [open, setLocaleCode]);

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
        onAction: handleAdd,
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
          options={SHOP_LOCALE_OPTIONS}
          value={localeCode}
          onChange={setLocaleCode}
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

  const handleRemove = React.useCallback(() =>
    disableLocale({ variables: { localeCode: locale.code } }), [disableLocale, locale]);

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
        content: "Remove",
        onAction: handleRemove,
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

const TogglePublishButton = ({ locale, published }) => {
  const [updateLocale, { loading }] = useUpdateLocaleMutation();

  const handleUpdate = React.useCallback(() =>
    updateLocale({
      variables: {
        localeCode: locale.code,
        shopLocale: { published: !published }
      }
    }), [updateLocale, locale, published]);

  return (
    <Button
      size="slim"
      loading={loading}
      onClick={handleUpdate}
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
            renderItem={(locale) => {
              const { code, name, published } = locale;
              return (
                <ResourceItem id={code}>
                  <Stack>
                    <Stack.Item fill>
                      <TextStyle variation="strong">{name}</TextStyle>
                    </Stack.Item>
                    <ButtonGroup segmented>
                      <TogglePublishButton
                        locale={locale}
                        published={published}
                      />
                      {!published && <RemoveLocaleModal locale={locale} />}
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
