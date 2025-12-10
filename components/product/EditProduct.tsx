import { defineMessages, useIntl } from "react-intl";
import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";

import { ABSOLUTE_URL } from "../../utilities/api";
import { ADMIN_GET_AVAILABLE_LANGUAGES } from "../../gql/admin";
import {
  ADMIN_UPDATE_PRODUCT,
  GET_FULL_PRODUCT_BY_ID,
} from "../../gql/product";
import { InputFieldWrapper } from "../form/InputFieldWrapper";
import {
  LanguageCode,
  Product,
  Product as ProductType,
  RecommendationType,
} from "../../schema";
import { pathnamesByLanguage } from "../../utilities/urls";
import { productToJsonLd } from "../../utilities/json-ld";
import { requestAdmin } from "../../utilities/request";
import { stripTags } from "../../utilities/decode";
import { useAuthenticate } from "../../utilities/hooks";
import { useRouter } from "next/router";
import Button from "../elements/Button";
import Card from "../layout/Card";
import EditVariants from "./edit/EditVariants";
import Head from "next/head";
import JsonLd from "../seo/JsonLd";
import LanguageChooser from "../LanguageChooser";
import Link from "next/link";
import Placeholder from "../elements/Placeholder";
import ProductCrossSells from "./ProductCrossSells";
import dynamic from "next/dynamic";
import formMessages from "../../i18n/form";
import useSWR, { mutate } from "swr";

const Label = styled.label`
  margin-bottom: 0.25rem;
  display: inline-block;
`;

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
//import "../../styles/quill-custom.scss";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    //["blockquote", "code-block"],

    //[{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    //[{ script: "sub" }, { script: "super" }], // superscript/subscript
    //[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    //[{ direction: "rtl" }], // text direction

    //[{ size: ["small", false, "large", "huge"] }], // custom dropdown

    //[{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //[{ font: [] }],
    //[{ align: [] }],
    ["link"],

    ["clean"], // remove formatting button
  ],
  clipboard: {
    matchVisual: false,
  },
};

const messages = defineMessages({
  name: {
    id: "EditProduct.name",
    defaultMessage: "Produktname",
  },
  slug: {
    id: "EditProduct.slug",
    defaultMessage: "Slug",
  },
  description: {
    id: "EditProduct.description",
    defaultMessage: "Produktbeschreibung",
  },
  variants: {
    id: "EditProduct.variants",
    defaultMessage: "Produktvarianten",
  },
  backToProduct: {
    id: "EditProduct.backToProduct",
    defaultMessage: "Zurück zum Produkt",
  },
});

const ProductCard = styled(Card)`
  margin-bottom: 0;
`;

interface FormAction {
  type: "update";
  language: LanguageCode;
  field: "name" | "slug" | "description";
  value: string;
}

type FormState = {
  [language: string]: {
    name?: string;
    slug?: string;
    description?: string;
  };
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "update":
      return {
        ...state,
        [action.language]: {
          ...state[action.language],
          [action.field]: action.value,
        },
      };
    default:
      throw new Error();
  }
};

const EditProduct: FunctionComponent<{
  product?: ProductType | null;
}> = React.memo(({ product }) => {
  if (!product) {
    return <Placeholder block />;
  }

  const intl = useIntl();
  const router = useRouter();

  const [language, setLanguage] = useState<LanguageCode>(
    intl.locale as LanguageCode
  );

  const { data: languages /*, error: languagesError*/ } = useSWR<{
    globalSettings: { availableLanguages: LanguageCode[] };
  }>(ADMIN_GET_AVAILABLE_LANGUAGES, (query: string) =>
    requestAdmin(intl.locale, query)
  );

  const [form, dispatch] = useReducer(formReducer, {}, () =>
    product.translations.reduce<FormState>((state, translation) => {
      state[translation.languageCode] = {
        name: translation.name,
        slug: translation.slug,
        description: translation.description,
      };
      return state;
    }, {} as FormState)
  );

  /*const isDifferent =
    form[language].description !==
    product.translations.find((t) => t.languageCode === language)?.description
      ? true
      : false;*/

  const crosssellRef = useRef(null);
  const crosssells = useMemo(
    () =>
      product.recommendations.filter(
        (r) => r.type === RecommendationType.Crosssell
      ),
    [product]
  );
  const upsells = useMemo(
    () =>
      product.recommendations.filter(
        (r) => r.type === RecommendationType.Upsell
      ),
    [product]
  );

  const isAdmin = useAuthenticate();

  useEffect(() => {
    if (!isAdmin) {
      router.push(
        `/${intl.locale}/${
          pathnamesByLanguage.product.languages[intl.locale]
        }/${product.slug}`
      );
    }
  }, [isAdmin]);

  return (
    <div>
      <Head>
        <title key="title">{`${stripTags(
          product.name
        )} - Hauser Feuerschutz AG`}</title>
        {/* <meta name="description" content={stripTags(product.description)} /> */}
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${intl.locale}/${
            pathnamesByLanguage.editProduct.languages[intl.locale]
          }/${product.slug}`}
        />
      </Head>
      <JsonLd>
        {{
          "@context": "http://schema.org/",
          ...productToJsonLd(product),
        }}
      </JsonLd>
      <ProductCard>
        <Link
          href={`/${intl.locale}/${
            pathnamesByLanguage.product.languages[intl.locale]
          }/${product.slug}`}
        >
          {intl.formatMessage(messages.backToProduct)}
        </Link>
        <hr />
        <LanguageChooser value={language} onChange={setLanguage} />
        <div>
          <InputFieldWrapper>
            <Label>{intl.formatMessage(messages.name)}</Label>
            <input
              type="text"
              value={form[language]?.name || ""}
              onChange={(e) =>
                dispatch({
                  type: "update",
                  language,
                  field: "name",
                  value: e.target.value,
                })
              }
            />
          </InputFieldWrapper>
        </div>
        <div>
          <InputFieldWrapper>
            <Label>{intl.formatMessage(messages.slug)}</Label>
            <input
              type="text"
              value={form[language]?.slug || ""}
              onChange={(e) =>
                dispatch({
                  type: "update",
                  language,
                  field: "slug",
                  value: e.target.value,
                })
              }
            />
          </InputFieldWrapper>
        </div>
        <div>
          <InputFieldWrapper>
            <Label>{intl.formatMessage(messages.description)}</Label>
            {languages
              ? languages.globalSettings.availableLanguages
                  .filter((lang) => lang === language)
                  .map((lang) => (
                    <ReactQuill
                      key={lang}
                      theme="snow"
                      modules={QUILL_MODULES}
                      value={form[language]?.description || ""}
                      onChange={(newDescription) => {
                        dispatch({
                          type: "update",
                          language,
                          field: "description",
                          value: newDescription,
                        });
                      }}
                    />
                  ))
              : null}
          </InputFieldWrapper>
        </div>
        <Button
          onClick={() =>
            requestAdmin(intl.locale, ADMIN_UPDATE_PRODUCT, {
              input: {
                id: product.id,
                translations: Object.keys(form).map((key) => ({
                  languageCode: key,
                  name: form[key].name,
                  slug: form[key].slug,
                  description: form[key].description,
                })),
              },
            }).then((response: { updateProduct: Product }) => {
              mutate([GET_FULL_PRODUCT_BY_ID, product.id], {
                product: response.updateProduct,
              });
              return true;
            })
          }
        >
          {intl.formatMessage(formMessages.saveChanges)}
        </Button>
        <hr />
        <h2>{intl.formatMessage(messages.variants)}</h2>
        <EditVariants variants={product.variants} itemsPerPage={5} />
      </ProductCard>

      <ProductCrossSells
        productId={product.id}
        productSlug={product.slug}
        crosssellRef={crosssellRef}
        crosssells={crosssells}
        upsells={upsells}
      />
    </div>
  );
});
export default EditProduct;
