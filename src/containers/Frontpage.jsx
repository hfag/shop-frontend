import React from "react";
import { connect } from "react-redux";
import ProductCategories from "containers/ProductCategories";
import { FormattedMessage } from "react-intl";

import {
  getSales,
  getProducts,
  getStickyPosts,
  getLanguage
} from "../reducers";
import SaleProducts from "../components/SaleProducts";

const Frontpage = React.memo(({ language, saleProducts, posts }) => {
  return (
    <div>
      {(saleProducts.length > 0 || posts.length > 0) && (
        <SaleProducts
          language={language}
          saleProducts={saleProducts}
          posts={posts}
        />
      )}
      <h2>
        <FormattedMessage
          id="Frontpage.titles.categories"
          defaultMessage="Kategorien"
        />
      </h2>
      <ProductCategories />
    </div>
  );
});

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
