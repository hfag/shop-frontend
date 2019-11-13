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
  ourProducts: {
    id: "Frontpage.ourProducts",
    defaultMessage: "Unsere Produkte"
  },
  moreAboutCompany: {
    id: "Frontpage.moreAboutCompany",
    defaultMessage: "Mehr über das Unternehmen"
  },
  aboutCompany: {
    id: "Frontpage.aboutCompany",
    defaultMessage:
      "Die 1970 gegründete Firma bietet Ihnen Dienstleistungen und Produkte in den Bereichen Sicherheitskennzeichnung, Trittschutz und Feuerschutz an. Die Faszination der Lumineszenz bewegte uns hin zu einem führenden Schweizer Fachunternehmen für langnachleuchtende Produkte. Als kleines Familienunternehmen sind wir auf Ihre Zufriedenheit angewiesen. Teilen Sie uns Ihre Anliegen mit!"
  }
});

const H1 = styled.h1`
  margin-top: 0;
`;

const H2 = styled.h2`
  margin-bottom: 0;
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
        <H2>{intl.formatMessage(messages.ourProducts)}</H2>
        <ProductCategories />
        <LatestPosts />
        <Card>
          <H1>Hauser Feuerschutz AG</H1>
          <p>{intl.formatMessage(messages.aboutCompany)}</p>
          <Link
            to={`/${language}/${pathnamesByLanguage[language].page}/${pageSlugsByLanguage[language].companyAbout}`}
            styled
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
