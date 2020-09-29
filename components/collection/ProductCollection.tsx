import React, { useEffect, useMemo, FunctionComponent } from "react";
import { Box } from "reflexbox";
import { useIntl, defineMessages } from "react-intl";
import styled from "styled-components";
import { Product as JsonLdProduct } from "schema-dts";

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
import Head from "next/head";
import { Collection, CollectionLinkType } from "../../schema";
import { ABSOLUTE_URL } from "../../utilities/api";

import ProductCollectionLinks from "./ProductCollectionLinks";
import { productToJsonLd } from "../../utilities/json-ld";

const H1 = styled.h1`
  margin: 0 0 0.5rem 0;
`;

const InfoWrapper = styled.div`
  margin: 2rem 1rem;
`;

const ProductCollectionWrapper = styled.div`
  margin-bottom: 1rem;
`;

const ProductCategoryHead: FunctionComponent<{
  collection: Collection;
}> = React.memo(({ collection }) => {
  const intl = useIntl();
  return (
    <Head>
      <title>
        {collection
          ? stripTags(collection.name) + " - Hauser Feuerschutz AG"
          : intl.formatMessage(shop.siteTitle)}
      </title>
      {/* {collection && (
        <meta name="description" content={stripTags(collection.description)} />
      )} */}
      {collection && (
        <link
          rel="canonical"
          href={
            collection &&
            `${ABSOLUTE_URL}/${intl.locale}/${
              pathnamesByLanguage.productCategory.languages[intl.locale]
            }/${collection.slug}`
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

  const productsJsonLd = useMemo<JsonLdProduct[]>(
    () => collection.products.map(productToJsonLd),
    [collection]
  );

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
                <ProductCollectionLinks collection={collection} />
              </Flex>
            </InfoWrapper>
          </>
        )}
        <Flex flexWrap="wrap" style={{ overflowX: "hidden" }}>
          {collection &&
            collection.children
              .sort((a, b) => a.position - b.position)
              .map((collection) => (
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
