import React, { useState, useEffect, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import { push } from "connected-react-router";
import {
  getProducts,
  getProductCategoryChildrenIdsById,
  getProductCategoryBySlug
} from "reducers";
import { Helmet } from "react-helmet";
import { defineMessages, injectIntl } from "react-intl";

import Flex from "../components/Flex";
import Pagination from "../components/Pagination";
import CategoryItem from "../containers/CategoryItem";
import ProductItem from "../containers/ProductItem";
import { fetchAllProductCategoriesIfNeeded } from "../actions/product/categories";
import { fetchProducts } from "../actions/product";
import JsonLd from "../components/JsonLd";
import { stripTags } from "../utilities";
import {
  getAttachmentById,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import { productToJsonLd, attachmentToJsonLd } from "../utilities/json-ld";
import Card from "../components/Card";
import OverflowCard from "../components/OverflowCard";
import { pathnamesByLanguage } from "../utilities/urls";
import shop from "../i18n/shop";

const ITEMS_PER_PAGE = 60;
const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const Head = React.memo(
  injectIntl(({ language, category, intl }) => {
    return (
      <Helmet
        title={
          category
            ? stripTags(category.name) + " - Hauser Feuerschutz AG"
            : intl.formatMessage(shop.siteTitle)
        }
        meta={[
          {
            name: "description",
            content: category && category.shortDescription
          }
        ]}
        link={[
          {
            rel: "canonical",
            href:
              category &&
              `${ABSOLUTE_URL}/${language}/${
                pathnamesByLanguage[language].productCategories
              }/${category.slug}`
          }
        ]}
      />
    );
  })
);

const RichSnippet = React.memo(({ productsJsonLd }) => (
  <JsonLd>
    {{ "@context": "http://schema.org", "@graph": productsJsonLd }}
  </JsonLd>
));

const ProductCategories = React.memo(
  ({
    location: { pathname },
    match: {
      url,
      params: { categorySlug, page }
    },
    category,
    fetchAllProductCategoriesIfNeeded,
    fetchProducts,
    dispatch,
    /* render props*/
    language,
    totalProductCount,
    categoryIds,
    productIds,
    parents = [],
    productsJsonLd
  }) => {
    const categoryId = (category && category.id) || 0;

    //check if endings match
    const active = useMemo(
      () => pathname.substring(pathname.length - url.length) === url,
      [pathname, url]
    );

    const urlWithoutPage = useMemo(
      () =>
        page
          ? url
              .split("/")
              .slice(0, -1)
              .join("/")
          : url,
      [page, url]
    );

    const newParents = useMemo(
      () => (categorySlug ? [...parents, categorySlug] : []),
      [categorySlug, parents]
    );

    const onPageChange = useCallback(
      ({ selected }) => {
        dispatch(push(`${urlWithoutPage}/${selected + 1}`));
      },
      [categorySlug, urlWithoutPage]
    );

    useEffect(() => {
      //load data
      fetchAllProductCategoriesIfNeeded();

      if (!active || !category || !categoryId) {
        return;
      }
      fetchProducts(categoryId);
    }, [categoryId]);

    useEffect(() => {
      if (active && (!page || isNaN(page)) && categorySlug) {
        //exclude frontpage
        dispatch(
          push(pathname + (pathname.slice(-1) === "/" ? "" : "/") + "1")
        );
      }
    }, []); //only run this once on the initial render

    return (
      <div>
        {active && (
          <div>
            <Head language={language} category={category} />
            <RichSnippet productsJsonLd={productsJsonLd} />
            {category && category.description && (
              <OverflowCard>
                <div
                  dangerouslySetInnerHTML={{
                    __html: category.description
                  }}
                />
              </OverflowCard>
            )}
            <Flex flexWrap="wrap">
              {categoryIds.map(categoryId => (
                <CategoryItem
                  key={categoryId}
                  id={categoryId}
                  parents={newParents}
                />
              ))}
            </Flex>
            {categoryIds.length > 0 && productIds.length > 0 && <hr />}
            <Flex flexWrap="wrap">
              {productIds.map(productId => (
                <ProductItem
                  key={productId}
                  id={productId}
                  parents={newParents}
                />
              ))}

              {categoryIds.length === 0 &&
                productIds.length === 0 &&
                new Array(12)
                  .fill()
                  .map((el, index) => <CategoryItem key={index} id={-1} />)}
            </Flex>
            {totalProductCount !== 0 && (
              <Pagination
                pageCount={Math.ceil(totalProductCount / ITEMS_PER_PAGE)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                previousLabel={"<"}
                nextLabel={">"}
                forcePage={parseInt(page) - 1}
                onPageChange={onPageChange}
              />
            )}
          </div>
        )}
        <Route
          path={`${urlWithoutPage}/:categorySlug/:page`}
          render={props => <RoutedCategories {...props} parents={newParents} />}
        />
      </div>
    );
  }
);

const mapStateToProps = (
  state,
  {
    match: {
      params: { categorySlug, page }
    }
  }
) => {
  const category = getProductCategoryBySlug(state, categorySlug);
  const products = category
    ? getProducts(state)
        .filter(product => product && product.categoryIds.includes(category.id))
        .sort((a, b) => a.order - b.order)
    : [];

  return {
    language: getLanguage(state),
    languageFetchString: getLanguageFetchString(state),
    categorySlug,
    category,
    categoryIds:
      getProductCategoryChildrenIdsById(
        state,
        categorySlug && category ? category.id : 0
      ) || [],
    productIds: category
      ? products
          .map(product => product.id)
          .slice(ITEMS_PER_PAGE * (page - 1), ITEMS_PER_PAGE * page)
      : [],
    totalProductCount: category ? products.length : 0,
    page,
    productsJsonLd: products.map(product =>
      productToJsonLd(
        product,
        attachmentToJsonLd(getAttachmentById(state, product.thumbnailId))
      )
    )
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  /**
   * Fetches all product catrgories
   * @param {number} perPage The amount of items per page
   * @param {string} language The language string
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAllProductCategoriesIfNeeded(
    perPage = ITEMS_PER_PAGE,
    language,
    visualize = true
  ) {
    return dispatch(
      fetchAllProductCategoriesIfNeeded(perPage, language, visualize)
    );
  },
  /**
   * Fetches the matching products
   * @param {number} [categoryId=null] The category id
   * @param {number} perPage The amount of products per page
   * @param {string} language The language string
   * @param {visualize} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProducts(
    categoryId,
    perPage = ITEMS_PER_PAGE,
    language,
    visualize = true
  ) {
    return categoryId /*&& !isNaN(page)*/
      ? dispatch(
          fetchProducts(
            1,
            -1,
            perPage,
            language,
            visualize,
            [],
            [parseInt(categoryId)]
          )
        )
      : Promise.reject("Called fetchProducts without valid categoryId");
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches all product catrgories
   * @param {number} perPage The amount of items per page
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAllProductCategoriesIfNeeded(
    perPage = ITEMS_PER_PAGE,
    visualize = true
  ) {
    return mapDispatchToProps.fetchAllProductCategoriesIfNeeded(
      perPage,
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Fetches the matching products
   * @param {number} [categoryId=null] The category id
   * @param {number} perPage The amount of products per page
   * @param {visualize} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProducts(categoryId, perPage = ITEMS_PER_PAGE, visualize = true) {
    return categoryId /*&& !isNaN(page)*/
      ? mapDispatchToProps.fetchProducts(
          categoryId,
          perPage,
          mapStateToProps.languageFetchString,
          visualize
        )
      : Promise.reject("Called fetchProducts without valid categoryId");
  }
});

const ConnectedCategories = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProductCategories);

const RoutedCategories = withRouter(ConnectedCategories);

export default RoutedCategories;
