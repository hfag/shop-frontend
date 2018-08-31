import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import styled from "styled-components";
import {
  getProducts,
  getProductCategoryChildrenIdsById,
  getProductCategoryBySlug
} from "reducers";

import CategoryItem from "../../containers/sidebar/CategoryItem";
import Card from "../../components/Card";
import Placeholder from "../../components/Placeholder";
import Link from "../../components/Link";
import { fetchProductCategories } from "../../actions/product/categories";
import SidebarListWrapper from "../../components/sidebar/SidebarListWrapper";
import SidebarBreadcrumb from "../../components/sidebar/SidebarBreadcrumb";

const ITEMS_PER_PAGE = 30;

/**
 * Renders all product categories
 * @returns {Component} The component
 */
class CategoriesSidebar extends React.PureComponent {
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

    this.setState({
      active: !pathname.startsWith("/produkte/") || pathname === url
    });
  };

  loadData = () => {
    const {
      categoryIds,
      fetchAllProductCategories,
      fetchProducts
    } = this.props;

    if (
      this.props.match.path !== "/" &&
      this.props.match.path !== "/produkte"
    ) {
      return;
    }

    //FIXME replace window.loading with something else
    if (
      (!categoryIds || categoryIds.length === 0) &&
      !window.loadingCategories
    ) {
      window.loadingCategories = true;

      fetchAllProductCategories().then(() => {
        window.loadingCategories = false;
      });
    }

    fetchProducts();
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
      }
    } = this.props;
    const { active } = this.state;

    const pathSegments = url.split("/");
    pathSegments.pop();
    const urlWithoutPage = page ? pathSegments.join("/") : url;

    const newParents = categorySlug ? [...parents, categorySlug] : [];

    return (
      <SidebarListWrapper>
        {categorySlug ? (
          <Link to={urlWithoutPage + "/1"}>
            <SidebarBreadcrumb active={active}>
              <div>⌄</div>
              <div>{category && category.name}</div>
            </SidebarBreadcrumb>
          </Link>
        ) : (
          <Link to="/">
            <SidebarBreadcrumb active={active}>
              <div>⌄</div>
              <div>Startseite</div>
            </SidebarBreadcrumb>
          </Link>
        )}

        {active && (
          <div>
            {categoryIds.length > 0 ? (
              <ul>
                <li className="header">
                  <h4>Kategorien</h4>
                </li>
                {categoryIds.map(categoryId => (
                  <CategoryItem
                    key={categoryId}
                    id={categoryId}
                    parents={newParents}
                  />
                ))}
              </ul>
            ) : null /*<p>Keine weiteren Unterkategorien gefunden</p>*/}
          </div>
        )}
        <Route
          path={`${urlWithoutPage}/:categorySlug/:page`}
          render={props => <RoutedSidebar {...props} parents={newParents} />}
        />
      </SidebarListWrapper>
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

  return {
    categorySlug,
    category,
    categoryIds:
      getProductCategoryChildrenIdsById(
        state,
        categorySlug && category ? category.id : 0
      ) || [],
    productIds: category
      ? getProducts(state)
          .filter(
            product =>
              product.categoryIds && product.categoryIds.includes(category.id)
          )
          .sort((a, b) => a.order - b.order)
          .map(product => product.id)
          .slice(ITEMS_PER_PAGE * (page - 1), ITEMS_PER_PAGE * page)
      : [],
    page
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
  fetchAllProductCategories(perPage = ITEMS_PER_PAGE, visualize = true) {
    return dispatch(fetchProductCategories(perPage, visualize));
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

const ConnectedSidebar = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CategoriesSidebar);

const RoutedSidebar = withRouter(ConnectedSidebar);

export default RoutedSidebar;
