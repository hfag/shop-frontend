import React from "react";
import { connect } from "react-redux";
import ProductCategories from "containers/ProductCategories";
import { defineMessages, injectIntl } from "react-intl";
import styled from "styled-components";
import { Flex, Box } from "reflexbox";

import {
  getSales,
  getProducts,
  getStickyPosts,
  getLanguage
} from "../reducers";
import SaleProducts from "../components/SaleProducts";
import Card from "../components/Card";
import LatestPosts from "./LatestPosts";
import { pathnamesByLanguage, pageSlugsByLanguage } from "../utilities/urls";
import Link from "../components/Link";

const messages = defineMessages({
  categories: {
    id: "Frontpage.categories",
    defaultMessage: "Produktkategorien"
  }
});

const H1 = styled.h1`
  margin: 0;
`;

const Frontpage = React.memo(
  injectIntl(({ language, saleProducts, posts, intl }) => {
    return (
      <div>
        {(saleProducts.length > 0 || posts.length > 0) && (
          <SaleProducts
            language={language}
            saleProducts={saleProducts}
            posts={posts}
          />
        )}
        <h2>{intl.formatMessage(messages.categories)}</h2>
        <ProductCategories />
        <LatestPosts />
      </div>
    );
  })
);

const mapStateToProps = state => {
  const sales = getSales(state),
    saleProductIds = sales.map(sale => sale.productId);
  const products = getProducts(state);

  return {
    language: getLanguage(state),
    saleProducts: products
      .filter(product => saleProductIds.includes(product.id))
      .map(product => ({
        ...sales.find(s => s.productId == product.id),
        ...product
      })),
    posts: getStickyPosts(state)
  };
};

export default connect(mapStateToProps)(Frontpage);
