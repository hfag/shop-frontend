import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defineMessages, IntlShape, useIntl } from "react-intl";
import { Box } from "reflexbox";
import styled from "styled-components";
import { FaRegFilePdf, FaLink, FaFilm } from "react-icons/fa";
import { MdDelete, MdArrowUpward } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

import { AppContext } from "../../pages/_app";
import {
  Asset,
  Collection,
  CollectionLinkType,
  LanguageCode,
} from "../../schema";
import Button from "../elements/Button";
import Flexbar from "../layout/Flexbar";
import StyledLink from "../elements/StyledLink";
import RestrictedView from "../elements/RestrictedView";
import { colors } from "../../utilities/style";
import { IconType } from "react-icons/lib";
import Select from "../elements/Select";
import { InputFieldWrapper } from "../form/InputFieldWrapper";
import ActionButton from "../ActionButton";
import { requestAdmin } from "../../utilities/request";
import {
  ADMIN_CREATE_COLLECTION_LINK_ASSET,
  ADMIN_CREATE_COLLECTION_LINK_URL,
  ADMIN_DELETE_COLLECTION_LINK,
  ADMIN_DELETE_COLLECTION_LINK_URL,
  ADMIN_GET_COLLECTION_LINKS_BY_SLUG,
  ADMIN_UPDATE_COLLECTION_LINK_ASSET,
  ADMIN_UPDATE_COLLECTION_LINK_URL,
  GET_COLLECTION_BY_ID,
  GET_COLLECTION_BY_SLUG,
} from "../../gql/collection";
import useSWR, { mutate } from "swr";
import {
  COLLECTION_LINK_TYPE_OPTIONS,
  DownloadList,
  ICON_BY_COLLECTION_LINK_TYPE,
} from "./ProductCollectionLinks";
import LanguageChooser from "../LanguageChooser";
import { FieldArray, FormikProps, withFormik } from "formik";
import SelectField from "../form/SelectField";
import InputField from "../form/InputField";
import AssetField from "../form/AssetField";

const messages = defineMessages({
  saveLinks: {
    id: "ProductCategories.saveLinks",
    defaultMessage: "Links speichern",
  },
  cancel: {
    id: "ProductCategories.cancel",
    defaultMessage: "Abbrechen",
  },
  addUrl: {
    id: "ProductCategories.addUrl",
    defaultMessage: "URL hinzufügen",
  },
  addAsset: {
    id: "ProductCategories.addAsset",
    defaultMessage: "Datei hinzufügen",
  },
  chooseIcon: {
    id: "ProductCategories.chooseIcon",
    defaultMessage: "Wähle Icon",
  },
});

interface CollectionLinkTranslation {
  id?: string | number;
  languageCode: LanguageCode;
  name: string | number;
  url: string;
}

interface CollectionUrlLink {
  id: string | number;
  collectionId: string | number;
  icon: CollectionLinkType;
  translations: CollectionLinkTranslation[];
  __typename: "CollectionUrlLink";
}

interface CollectionAssetLink {
  id: string | number;
  collectionId: string | number;
  icon: CollectionLinkType;
  asset: Asset;
  __typename: "CollectionAssetLink";
}

type AdminCollectionLink = CollectionUrlLink | CollectionAssetLink;

interface IProps {
  intl: IntlShape;
  collection: Collection;
  onSave: () => void;
  onAbort: () => void;
}

interface FormValues {
  links: AdminCollectionLink[];
}

const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const EditProductCollectionLinksInnerForm: FunctionComponent<
  IProps & FormikProps<FormValues>
> = ({
  collection,
  onAbort,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  setValues,
  status,
}) => {
  const intl = useIntl();
  //@ts-ignore
  const [language, setLanguage] = useState<LanguageCode>(intl.locale);

  const { data, error } = useSWR<{
    collection: {
      id: number | string;
      slug: string;
      links: AdminCollectionLink[];
    };
  }>([ADMIN_GET_COLLECTION_LINKS_BY_SLUG, collection.slug], (query, slug) =>
    requestAdmin(intl.locale, query, { slug })
  );

  useEffect(() => {
    if (data?.collection?.links) {
      setValues({ links: data.collection.links });
    }
  }, [data]);

  useEffect(() => {
    if (
      values.links.find(
        (l) =>
          l.__typename === "CollectionUrlLink" &&
          !l.translations.find((t) => t.languageCode === language)
      )
    ) {
      setValues({
        links: values.links.map((link) => {
          if (
            link.__typename === "CollectionUrlLink" &&
            !link.translations.find((t) => t.languageCode === language)
          ) {
            return {
              ...link,
              translations: [
                ...link.translations,
                { languageCode: language, name: "", url: "" },
              ],
            };
          }

          return link;
        }),
      });
    }
  }, [language]);

  if (!data) {
    return <ClipLoader loading size={20} color={colors.primary} />;
  }

  return (
    <FieldArray
      name="links"
      render={({ swap, remove, insert }) => (
        <>
          {JSON.stringify(values)}
          <LanguageChooser value={language} onChange={setLanguage} />
          <DownloadList>
            {values.links.map((item, index) => {
              const translationIndex =
                "translations" in item
                  ? item.translations.findIndex(
                      (t) => t.languageCode === language
                    )
                  : -1;

              return (
                <li key={item.id}>
                  <Flexbar>
                    {item.__typename === "CollectionAssetLink" ? (
                      <>
                        <SelectField
                          name={`links[${index}].icon`}
                          placeholder={intl.formatMessage(messages.chooseIcon)}
                          options={COLLECTION_LINK_TYPE_OPTIONS}
                          formatOptionLabel={(option) => {
                            const Icon =
                              ICON_BY_COLLECTION_LINK_TYPE[option.value];
                            return (
                              <Flexbar>
                                <Icon size={16} /> {option.value}
                              </Flexbar>
                            );
                          }}
                          width={7}
                          flexGrow={1}
                          marginRight={1}
                        />
                        <AssetField
                          name={`links[${index}].asset`}
                          flexGrow={1}
                          marginRight={1}
                        />
                      </>
                    ) : (
                      <>
                        <SelectField
                          name={`links[${index}].icon`}
                          placeholder={intl.formatMessage(messages.chooseIcon)}
                          options={COLLECTION_LINK_TYPE_OPTIONS}
                          formatOptionLabel={(option) => {
                            const Icon =
                              ICON_BY_COLLECTION_LINK_TYPE[option.value];
                            return (
                              <Flexbar>
                                <Icon size={16} /> {option.value}
                              </Flexbar>
                            );
                          }}
                          width={7}
                          flexGrow={1}
                          marginRight={1}
                        />
                        <InputField
                          type="text"
                          name={`links[${index}].translations[${translationIndex}].name`}
                          placeholder="Dateiname"
                          flexGrow={1}
                          marginRight={1}
                        />
                        <InputField
                          type="text"
                          name={`links[${index}].translations[${translationIndex}].url`}
                          placeholder="https://feuerschutz.ch/file-49583.pdf"
                          flexGrow={1}
                          marginRight={1}
                        />
                      </>
                    )}
                    {index === 0 ? (
                      <MdArrowUpward color={colors.disabled} />
                    ) : (
                      <ActionButton
                        onClick={
                          index === 0 ? undefined : () => swap(index, index - 1)
                        }
                        hoverColor={colors.info}
                      >
                        <MdArrowUpward />
                      </ActionButton>
                    )}
                    <ActionButton>
                      <MdDelete
                        onClick={() => {
                          remove(index);
                        }}
                      />
                    </ActionButton>
                  </Flexbar>
                </li>
              );
            })}
          </DownloadList>
          <Buttons>
            <Button
              onClick={() => {
                insert(values.links.length, {
                  __typename: "CollectionUrlLink",
                  collectionId: collection.id,
                  icon: CollectionLinkType.Pdf,
                  translations: [
                    { languageCode: intl.locale, name: "", url: "" },
                  ],
                });

                return Promise.resolve();
              }}
            >
              {intl.formatMessage(messages.addUrl)}
            </Button>
            <Button
              onClick={() => {
                insert(values.links.length, {
                  __typename: "CollectionAssetLink",
                  asset: { id: null },
                  collectionId: collection.id,
                  icon: CollectionLinkType.Pdf,
                });

                return Promise.resolve();
              }}
              marginLeft={0.5}
            >
              {intl.formatMessage(messages.addAsset)}
            </Button>
          </Buttons>
          <Buttons>
            <Button state={status} onClick={handleSubmit}>
              {intl.formatMessage(messages.saveLinks)}
            </Button>
            <Button onClick={() => onAbort()} marginLeft={0.5}>
              {intl.formatMessage(messages.cancel)}
            </Button>
          </Buttons>
        </>
      )}
    />
  );
};

const EditProductCollectionLinks = withFormik<
  IProps,
  { links: AdminCollectionLink[] }
>({
  mapPropsToValues: () => ({
    links: [],
  }),
  handleSubmit: (
    values,
    { props: { intl, collection, onSave }, setStatus }
  ) => {
    const links = values.links.map((l, index) => ({ ...l, order: index }));
    setStatus("loading");
    const createPromises = links
      .filter((link) => !("linkId" in link))
      .map((link) => {
        if (link.__typename === "CollectionUrlLink") {
          return requestAdmin(intl.locale, ADMIN_CREATE_COLLECTION_LINK_URL, {
            input: {
              collectionId: link.collectionId,
              icon: link.icon,
              order: link.order,
              translations: link.translations,
            },
          });
        } else {
          return requestAdmin(intl.locale, ADMIN_CREATE_COLLECTION_LINK_ASSET, {
            input: {
              collectionId: link.collectionId,
              icon: link.icon,
              order: link.order,
              assetId: link.asset.id,
            },
          });
        }
      });

    const updatePromises = links
      .filter((link) => "linkId" in link)
      .map((link) => {
        if (link.__typename === "CollectionUrlLink") {
          return requestAdmin(intl.locale, ADMIN_UPDATE_COLLECTION_LINK_URL, {
            input: {
              //@ts-ignore
              id: link.linkUrlId,
              icon: link.icon,
              order: link.order,
              translations: link.translations,
            },
          });
        } else {
          return requestAdmin(intl.locale, ADMIN_UPDATE_COLLECTION_LINK_ASSET, {
            input: {
              //@ts-ignore
              id: link.linkAssetId,
              icon: link.icon,
              order: link.order,
              assetId: link.asset.id,
            },
          });
        }
      });

    const deletePromises = collection.links
      .filter(
        //@ts-ignore
        (link) => !links.find((l) => "linkId" in l && l.linkId === link.id)
      )
      .map((link) =>
        requestAdmin(intl.locale, ADMIN_DELETE_COLLECTION_LINK, {
          id: link.id,
        })
      );

    return Promise.all([
      ...createPromises,
      ...updatePromises,
      ...deletePromises,
    ]).then(() => {
      setStatus("success");
      setTimeout(() => setStatus(""), 300);
      onSave();
    });
  },
})(EditProductCollectionLinksInnerForm);

export default EditProductCollectionLinks;
