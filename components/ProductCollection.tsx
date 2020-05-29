import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  FunctionComponent
} from "react";
import { Box } from "reflexbox";
import { useIntl, defineMessages } from "react-intl";
import styled from "styled-components";
import { Product as JsonLdProduct } from "schema-dts";
import Router from "next/router";
import { FaInfoCircle, FaRegFilePdf, FaLink, FaFilm } from "react-icons/fa";

import Flex from "./Flex";
import CollectionItem from "./CollectionItem";
import ProductItem from "./ProductItem";
import JsonLd from "./seo/JsonLd";
import { stripTags } from "../utilities/decode";
import { productToJsonLd } from "../utilities/json-ld";
import Card from "./layout/Card";
import { pathnamesByLanguage } from "../utilities/urls";
import shop from "../i18n/shop";
import { setProductCategoryView, trackPageView } from "../utilities/analytics";
import Flexbar from "./layout/Flexbar";
import UnsafeHTMLContent from "./content/UnsafeHTMLContent";
import Head from "next/head";
import { Language } from "../utilities/i18n";
import { Collection } from "../schema";
import useSWR from "swr";
import { GET_COLLECTION } from "../gql/collection";
import { API_URL, ABSOLUTE_URL } from "../utilities/api";
import request from "../utilities/request";

const messages = defineMessages({
  downloadsAndLinks: {
    id: "ProductCategories.downloadsAndLinks",
    defaultMessage: "Downloads und Links"
  }
});

const H1 = styled.h1`
  margin: 0 0 0.5rem 0;
`;
const H2 = styled.h2`
  margin-top: 0;
`;

const InfoWrapper = styled.div`
  margin: 2rem 1rem;
`;

const DownloadList = styled.ul`
  margin: 0;
  padding: 0;

  list-style: none;

  li {
    margin-bottom: 0.5rem;
  }

  li svg {
    display: block;
    margin-right: 0.5rem;
  }
`;

const ProductCategoryHead: FunctionComponent<{
  collection: Collection;
}> = React.memo(({ collection }) => {
  const intl = useIntl();
  //TODO change to slug!!
  return (
    <Head>
      <title>
        {collection
          ? stripTags(collection.name) + " - Hauser Feuerschutz AG"
          : intl.formatMessage(shop.siteTitle)}
      </title>
      <meta
        name="description"
        content={
          collection
            ? collection.customFields.seoDescription
            : intl.formatMessage(shop.siteMessage)
        }
      />
      {collection && (
        <link
          rel="canonical"
          href={
            collection &&
            `${ABSOLUTE_URL}/${intl.locale}/${
              pathnamesByLanguage.productCategory.languages[intl.locale]
            }/${collection.id}`
          }
        />
      )}
    </Head>
  );
});

const RichSnippet: FunctionComponent<{
  productsJsonLd: JsonLdProduct[];
}> = React.memo(({ productsJsonLd }) => (
  <JsonLd>
    {{ "@context": "http://schema.org", "@graph": productsJsonLd }}
  </JsonLd>
));

const ProductCollection: FunctionComponent<{
  collectionId: number;
  showDescription?: boolean;
  initialData?: { collection: Collection };
}> = React.memo(({ collectionId, initialData, showDescription }) => {
  const intl = useIntl();

  const { data, error } = useSWR(
    [GET_COLLECTION, collectionId],
    (query, collectionId) => request(API_URL, query, { id: collectionId }),
    {
      initialData
    }
  );
  const loading = !data;

  const productsJsonLd = useMemo<JsonLdProduct[]>(() => {
    //TODO JsonLd
    return [];
  }, [data]);

  useEffect(() => {
    if (!data.collection) {
      return;
    }

    trackPageView();
    setProductCategoryView(stripTags(data.collection.name));
  }, [data]); //caching ensures the object stays the same?

  return (
    <div>
      <div>
        {data.collection && showDescription && (
          <>
            <ProductCategoryHead collection={data.collection} />
            <RichSnippet productsJsonLd={productsJsonLd} />
            <InfoWrapper>
              <Flex flexWrap="wrap">
                <Box width={[1, 1, 1 / 2, 1 / 2]} pr={[0, 0, 4, 4]}>
                  <H1
                    dangerouslySetInnerHTML={{ __html: data.collection.name }}
                  ></H1>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.collection.description
                    }}
                  ></div>
                </Box>
                {/*category.links && category.links.length > 0 && (
                <Box width={[1, 1, 1 / 2, 1 / 2]}>
                  <H2>{intl.formatMessage(messages.downloadsAndLinks)}</H2>
                  <DownloadList>
                    {category.links.map((link, index) => {
                      let Icon;
                      let url;
                      let target;

                      switch (link.type) {
                        case "pdf":
                          Icon = FaRegFilePdf;
                          url = link.url;
                          target = "_blank";
                          break;

                        case "video":
                          Icon = FaFilm;
                          url = link.url;
                          target = "_blank";

                          break;
                        case "link":
                        default:
                          Icon = FaLink;
                          url = link.url;
                          target = "_blank";
                      }

                      return (
                        <li key={index}>
                          <Flexbar>
                            <Icon size={24} />{" "}
                            <Link href={url} target={target} styled>
                              {link.title}
                            </Link>
                          </Flexbar>
                        </li>
                      );
                    })}
                  </DownloadList>
                </Box>
                  )*/}
              </Flex>
            </InfoWrapper>
          </>
        )}
        <Flex flexWrap="wrap" style={{ overflowX: "hidden" }}>
          {data.collection &&
            data.collection.children.map((collection) => (
              <CollectionItem
                key={"collection-" + data.collection.id}
                collection={data.collection}
              />
            ))}
          {data.collection &&
            data.collection.products.map((product) => (
              <ProductItem key={"product-" + product.id} product={product} />
            ))}

          {loading &&
            new Array(12)
              .fill(0)
              .map((el, index) => <CollectionItem key={index} />)}
        </Flex>
      </div>
    </div>
  );
});

export default ProductCollection;
