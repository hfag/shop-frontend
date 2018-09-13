import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import { push } from "react-router-redux";
import {
  getProducts,
  getProductCategoryChildrenIdsById,
  getProductCategoryBySlug
} from "reducers";
import { Helmet } from "react-helmet";
import ChevronLeft from "react-icons/lib/fa/chevron-left";
import ChevronRight from "react-icons/lib/fa/chevron-right";

import Flex from "../components/Flex";
import Pagination from "../components/Pagination";
import CategoryItem from "../containers/CategoryItem";
import ProductItem from "../containers/ProductItem";
import { fetchAllProductCategoriesIfNeeded } from "../actions/product/categories";
import { fetchProducts } from "../actions/product";
import JsonLd from "../components/JsonLd";
import { stripTags } from "../utilities";
import { getAttachmentById } from "../reducers";
import { productToJsonLd, attachmentToJsonLd } from "../utilities/json-ld";
import Card from "../components/Card";
import OverflowCard from "../components/OverflowCard";

const ITEMS_PER_PAGE = 30;
const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * Renders all product categories
 * @returns {Component} The component
 */
class ProductCategories extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { active: props.location.pathname === props.match.url };
  }
  componentDidMount = () => {
    this.loadData();
  };

  /**
   * Lifecycle method
   * @param {Object} prevProps The previous props
   * @returns {void}
   */
  componentDidUpdate = prevProps => {
    const {
      match: {
        params: { categorySlug, page },
        url
      },
      location: { pathname },
      category
    } = this.props;
    if (
      (categorySlug !== prevProps.categorySlug ||
        page !== prevProps.page ||
        (!prevProps.category && category)) &&
      categorySlug &&
      page
    ) {
      this.loadData();
    }

    this.setState({ active: pathname === url });
  };
  loadData = () => {
    const {
      categoryIds,
      fetchAllProductCategoriesIfNeeded,
      fetchProducts
    } = this.props;

    if (!this.state.active) {
      return;
    }

    fetchAllProductCategoriesIfNeeded();
    fetchProducts();
  };
  onPageChange = ({ selected }) => {
    const {
      match: {
        params: { categorySlug, page }
      }
    } = this.props;
    this.props.dispatch(
      push("/produkte/" + categorySlug + "/" + (selected + 1))
    );
  };
  render = () => {
    const {
      category,
      categoryIds,
      productIds,
      parents = [],
      match: {
        params: { categorySlug, page },
        url
      },
      productsJsonLd
    } = this.props;
    const { active } = this.state;

    const pathSegments = url.split("/");
    pathSegments.pop();
    const urlWithoutPage = page ? pathSegments.join("/") : url;

    const newParents = categorySlug ? [...parents, categorySlug] : [];

    return (
      <div>
        <Helmet>
          <title>
            {category
              ? stripTags(category.name) + " - Hauser Feuerschutz AG"
              : "Shop der Hauser Feuerschutz AG"}
          </title>
          <meta
            name="description"
            content={
              category &&
              category.description &&
              stripTags(category.description)
            }
          />
          <link
            rel="canonical"
            href={category && ABSOLUTE_URL + "/produkte/" + category.slug}
          />
        </Helmet>
        {active && (
          <div>
            <JsonLd>
              {{ "@context": "http://schema.org", "@graph": productsJsonLd }}
            </JsonLd>
            {category &&
              category.description && (
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
            {productIds.length !== 0 && (
              <Pagination
                pageCount={Math.ceil(productIds.length / ITEMS_PER_PAGE)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                previousLabel={ChevronLeft}
                nextLabel={ChevronRight}
                forcePage={parseInt(page) - 1}
                onPageChange={this.onPageChange}
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
  };
}

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
    page,
    productsJsonLd: products.map(product =>
      productToJsonLd(
        product,
        attachmentToJsonLd(getAttachmentById(state, product.thumbnailId))
      )
    )
  };
};

const mapDispatchToProps = (
  dispatch,
  {
    match: {
      params: { categorySlug, page = 1 }
    }
  }
) => ({
  dispatch,
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
    return dispatch(fetchAllProductCategoriesIfNeeded(perPage, visualize));
  },
  /**
   * Fetches the matching products
   * @param {number} [categoryId=null] The category id
   * @param {number} perPage The amount of products per page
   * @param {visualize} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProducts(categoryId = null, perPage = ITEMS_PER_PAGE, visualize = true) {
    return categoryId && !isNaN(page)
      ? dispatch(
          fetchProducts(
            page,
            page,
            perPage,
            visualize,
            [],
            [parseInt(categoryId)]
          )
        )
      : Promise.resolve();
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches the matching products
   * @param {number} perPage The amount of products per page
   * @param {visualize} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProducts(perPage = ITEMS_PER_PAGE, visualize = true) {
    const page = parseInt(ownProps.match.params.page);
    const categoryId = mapStateToProps.category
      ? mapStateToProps.category.id
      : null;
    return mapDispatchToProps.fetchProducts(categoryId, perPage, visualize);
  }
});

const ConnectedCategories = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProductCategories);

const RoutedCategories = withRouter(ConnectedCategories);

export default RoutedCategories;
