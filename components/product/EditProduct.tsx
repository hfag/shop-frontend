import { defineMessages, useIntl } from "react-intl";
import React, { FunctionComponent, useEffect, useMemo, useRef } from "react";
import styled from "@emotion/styled";

import { ABSOLUTE_URL } from "../../utilities/api";
import { Product as ProductType, RecommendationType } from "../../schema";
import { pathnamesByLanguage } from "../../utilities/urls";
import { productToJsonLd } from "../../utilities/json-ld";
import { stripTags } from "../../utilities/decode";
import { useAuthenticate } from "../../utilities/hooks";
import { useRouter } from "next/router";
import Card from "../layout/Card";
import EditVariants from "./edit/EditVariants";
import Head from "next/head";
import JsonLd from "../seo/JsonLd";
import Link from "next/link";
import Placeholder from "../elements/Placeholder";
import ProductCrossSells from "./ProductCrossSells";

const messages = defineMessages({
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

const EditProduct: FunctionComponent<{
  product?: ProductType;
}> = React.memo(({ product }) => {
  if (!product) {
    return <Placeholder block />;
  }

  const intl = useIntl();
  const router = useRouter();

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
        <title>{stripTags(product.name)} - Hauser Feuerschutz AG</title>
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
        <h1>
          <span dangerouslySetInnerHTML={{ __html: product.name }} />
        </h1>
        <Link
          href={`${ABSOLUTE_URL}/${intl.locale}/${
            pathnamesByLanguage.product.languages[intl.locale]
          }/${product.slug}`}
        >
          {intl.formatMessage(messages.backToProduct)}
        </Link>
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
