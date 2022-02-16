import { Product as JsonLdProduct } from "schema-dts";
import { useIntl } from "react-intl";
import React, { FunctionComponent, useMemo } from "react";
import styled from "@emotion/styled";

import { ABSOLUTE_URL } from "../../utilities/api";
import { Collection } from "../../schema";
import { pathnamesByLanguage } from "../../utilities/urls";
import { stripTags } from "../../utilities/decode";
import CollectionItem from "./CollectionItem";
import Flex from "../layout/Flex";
import Head from "next/head";
import JsonLd from "../seo/JsonLd";
import ProductItem from "../product/ProductItem";
import shop from "../../i18n/shop";

import { productToJsonLd } from "../../utilities/json-ld";
import Box from "../layout/Box";
import ProductCollectionLinks from "./ProductCollectionLinks";

const H1 = styled.h1`
  margin: 0 0 0.5rem 0;
`;

const InfoWrapper = styled.div``;

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
  const productsJsonLd = useMemo<JsonLdProduct[]>(
    () => collection.products.map(productToJsonLd),
    [collection]
  );

  return (
    <ProductCollectionWrapper>
      <div>
        {collection && showDescription && (
          <>
            <ProductCategoryHead collection={collection} />
            <RichSnippet productsJsonLd={productsJsonLd} />
            <InfoWrapper>
              <Flex flexWrap="wrap">
                <Box
                  widths={[1, 1, 1, 1 / 2, 1 / 2]}
                  paddingRight={4 /* TODO: [0, 0, 4, 4] */}
                >
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
        <Flex
          flexWrap="wrap"
          style={{
            overflowX: "hidden",
            paddingTop: "3rem",
            marginTop: "-3rem",
          }}
          marginX
        >
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
            collection.products
              .sort((a, b) => a.customFields.ordering - b.customFields.ordering)
              .map((product) => (
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
