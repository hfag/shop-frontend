import React, { useEffect, useMemo, FunctionComponent } from "react";
import { Box } from "reflexbox";
import { useIntl, defineMessages } from "react-intl";
import styled from "styled-components";
import { Product as JsonLdProduct } from "schema-dts";
import { FaRegFilePdf, FaLink, FaFilm } from "react-icons/fa";

import Flex from "../layout/Flex";
import CollectionItem from "./CollectionItem";
import ProductItem from "../product/ProductItem";
import JsonLd from "../seo/JsonLd";
import { stripTags } from "../../utilities/decode";
import { pathnamesByLanguage } from "../../utilities/urls";
import shop from "../../i18n/shop";
import {
  setProductCategoryView,
  trackPageView,
} from "../../utilities/analytics";
import Flexbar from "../layout/Flexbar";
import Head from "next/head";
import { Collection, CollectionLinkType } from "../../schema";
import useSWR from "swr";
import { GET_COLLECTION } from "../../gql/collection";
import { ABSOLUTE_URL } from "../../utilities/api";
import request from "../../utilities/request";
import StyledLink from "../elements/StyledLink";

const messages = defineMessages({
  downloadsAndLinks: {
    id: "ProductCategories.downloadsAndLinks",
    defaultMessage: "Downloads und Links",
  },
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

const ProductCollectionWrapper = styled.div`
  margin-bottom: 1rem;
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
  showDescription?: boolean;
  collection?: Collection;
}> = React.memo(({ collection, showDescription }) => {
  const intl = useIntl();

  const productsJsonLd = useMemo<JsonLdProduct[]>(() => {
    //TODO JsonLd
    return [];
  }, [collection]);

  useEffect(() => {
    if (!collection) {
      return;
    }

    trackPageView();
    setProductCategoryView(stripTags(collection.name));
  }, [collection]); //caching ensures the object stays the same?

  return (
    <ProductCollectionWrapper>
      <div>
        {collection && showDescription && (
          <>
            <ProductCategoryHead collection={collection} />
            <RichSnippet productsJsonLd={productsJsonLd} />
            <InfoWrapper>
              <Flex flexWrap="wrap">
                <Box width={[1, 1, 1 / 2, 1 / 2]} pr={[0, 0, 4, 4]}>
                  <H1
                    dangerouslySetInnerHTML={{ __html: collection.name }}
                  ></H1>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: collection.description,
                    }}
                  ></div>
                </Box>
                {collection && collection.links && collection.links.length > 0 && (
                  <Box width={[1, 1, 1 / 2, 1 / 2]}>
                    <H2>{intl.formatMessage(messages.downloadsAndLinks)}</H2>
                    <DownloadList>
                      {collection.links.map((link, index) => {
                        let Icon;
                        let url = link.url;
                        let target = "_blank";

                        switch (link.type) {
                          case CollectionLinkType.Pdf:
                            Icon = FaRegFilePdf;
                            target = "_blank";
                            break;

                          case CollectionLinkType.Video:
                            Icon = FaFilm;
                            target = "_blank";

                            break;
                          case CollectionLinkType.Link:
                          default:
                            Icon = FaLink;
                            target = "_blank";
                        }

                        return (
                          <li key={index}>
                            <Flexbar>
                              <Icon size={24} />{" "}
                              <StyledLink href={url} target={target} underlined>
                                {link.name}
                              </StyledLink>
                            </Flexbar>
                          </li>
                        );
                      })}
                    </DownloadList>
                  </Box>
                )}
              </Flex>
            </InfoWrapper>
          </>
        )}
        <Flex flexWrap="wrap" style={{ overflowX: "hidden" }}>
          {collection &&
            collection.children.map((collection) => (
              <CollectionItem
                key={"collection-" + collection.id}
                collection={collection}
              />
            ))}
          {collection &&
            collection.products.map((product) => (
              <ProductItem key={"product-" + product.id} product={product} />
            ))}

          {!collection &&
            new Array(12)
              .fill(0)
              .map((el, index) => <CollectionItem key={index} />)}
        </Flex>
      </div>
    </ProductCollectionWrapper>
  );
});

export default ProductCollection;
