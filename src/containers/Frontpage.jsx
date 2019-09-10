import React from "react";
import { connect } from "react-redux";
import ProductCategories from "containers/ProductCategories";
import { defineMessages, injectIntl } from "react-intl";
import styled from "styled-components";

import {
  getSales,
  getProducts,
  getStickyPosts,
  getLanguage
} from "../reducers";
import SaleProducts from "../components/SaleProducts";
import shop from "../i18n/shop";
import Card from "../components/Card";
import LatestPosts from "./LatestPosts";
import { pathnamesByLanguage, pageSlugsByLanguage } from "../utilities/urls";
import Link from "../components/Link";
import MediaQuery from "../components/MediaQuery";
import Searchbar from "./Searchbar";

const messages = defineMessages({
  categories: {
    id: "Frontpage.categories",
    defaultMessage: "Kategorien"
  },
  moreAboutCompany: {
    id: "Frontpage.moreAboutCompany",
    defaultMessage: "Mehr über das Unternehmen"
  }
});

const H1 = styled.h1`
  margin-top: 0;
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
        <Card>
          <H1>Hauser Feuerschutz AG</H1>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in
            vulputate velit esse molestie consequat, vel illum dolore eu feugiat
            nulla facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugait
            nulla facilisi.
          </p>
          <Link
            to={`/${pathnamesByLanguage[language].page}/${pageSlugsByLanguage[language].companyAbout}`}
          >
            {intl.formatMessage(messages.moreAboutCompany)}
          </Link>
        </Card>
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
