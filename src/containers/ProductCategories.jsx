import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import { Box } from "reflexbox";
import { push } from "connected-react-router";
import {
  getProducts,
  getProductCategoryChildrenIdsById,
  getProductCategoryBySlug
} from "reducers";
import { Helmet } from "react-helmet";
import { injectIntl } from "react-intl";
import styled from "styled-components";
import { FaInfoCircle } from "react-icons/fa";

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
import { setProductCategoryView, trackPageView } from "../utilities/analytics";
import Placeholder from "../components/Placeholder";
import MediaQuery from "../components/MediaQuery";
import Flexbar from "../components/Flexbar";

const ITEMS_PER_PAGE = 12;
const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const CategoryDescription = styled(Box)`
  & > div {
    margin: 0;
  }
  h2 {
    margin-top: 0;
  }
`;

const H1 = styled.h1`
  margin: 0;
`;

const InfoIcon = styled(FaInfoCircle)`
  margin-top: 0.4rem;
  margin-left: 0.25rem;
  cursor: pointer;
`;

const Head = React.memo(
  injectIntl(({ language, category, intl }) => {
    return (
      <Helmet>
        <title>
          {category
            ? stripTags(category.name) + " - Hauser Feuerschutz AG"
            : intl.formatMessage(shop.siteTitle)}
        </title>
        {category && (
          <meta name="description" content={category.shortDescription} />
        )}
        {category && (
          <link
            rel="canonical"
            href={
              category &&
              `${ABSOLUTE_URL}/${language}/${
                pathnamesByLanguage[language].productCategories
              }/${category.slug}`
            }
          />
        )}
      </Helmet>
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
    location: { pathname, search },
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

    const descriptionRef = useRef(null);
    const scrollToDescription = useCallback(() =>
      window.scrollTo({
        left: 0,
        top: descriptionRef.current.offsetTop,
        behavior: "smooth"
      })
    );

    useEffect(() => {
      //load data
      fetchAllProductCategoriesIfNeeded();

      if (!active || !category || !categoryId) {
        trackPageView();
        return;
      }

      fetchProducts(categoryId);

      setProductCategoryView(stripTags(category.name));
      trackPageView();
    }, [categoryId]);

    useEffect(() => {
      if (active && (!page || isNaN(page)) && categorySlug) {
        //exclude frontpage
        dispatch(
          push(
            pathname + (pathname.slice(-1) === "/" ? "" : "/") + "1" + search
          )
        );
      }
    }, []); //only run this once on the initial render

    const isLoading = categoryIds.length === 0 && productIds.length === 0;

    const hasCategoryDescription =
      category && category.description ? true : false;

    const categoryBoxWidths =
      hasCategoryDescription || isLoading ? [1, 1, 1, 1 / 2] : [1, 1, 1, 1];
    const categoryDescriptionBoxWidths =
      hasCategoryDescription || isLoading ? [1, 1, 1, 1 / 2] : [0, 0, 0, 0];

    return (
      <div>
        {active && (
          <div>
            <Head language={language} category={category} />
            <RichSnippet productsJsonLd={productsJsonLd} />
            {(isLoading || (category && category.name)) && (
              <Card>
                {category && category.name ? (
                  <Flexbar>
                    <H1>{category.name}</H1>
                    <MediaQuery sm down>
                      <InfoIcon size={24} onClick={scrollToDescription} />
                    </MediaQuery>
                  </Flexbar>
                ) : (
                  <Placeholder text />
                )}
              </Card>
            )}
            <Flex flexWrap="wrap">
              <Box width={categoryBoxWidths} px={2} pb={3}>
                <Flex flexWrap="wrap">
                  {categoryIds.map(categoryId => (
                    <CategoryItem
                      key={categoryId}
                      id={categoryId}
                      parents={newParents}
                      large={!hasCategoryDescription}
                    />
                  ))}
                  {productIds.map(productId => (
                    <ProductItem
                      key={productId}
                      id={productId}
                      parents={newParents}
                      large={!hasCategoryDescription}
                    />
                  ))}
                  {isLoading &&
                    new Array(12)
                      .fill()
                      .map((el, index) => <CategoryItem key={index} id={-1} />)}
                </Flex>
              </Box>
              {(hasCategoryDescription || isLoading) && (
                <CategoryDescription
                  width={categoryDescriptionBoxWidths}
                  px={2}
                  pb={3}
                  innerRef={descriptionRef}
                >
                  <Card>
                    {hasCategoryDescription && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: category.description
                        }}
                      />
                    )}
                    {isLoading && <Placeholder block height={2} />}
                  </Card>
                </CategoryDescription>
              )}
            </Flex>

            {totalProductCount !== 0 && (
              <Pagination
                pageCount={Math.ceil(totalProductCount / ITEMS_PER_PAGE)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
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
