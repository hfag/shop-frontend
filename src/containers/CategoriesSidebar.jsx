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

import CategoryItem from "../containers/sidebar/CategoryItem";
import ProductItem from "../containers/sidebar/ProductItem";
import Card from "../components/Card";
import { colors, borders } from "../utilities/style";
import Placeholder from "../components/Placeholder";
import Link from "../components/Link";

const ITEMS_PER_PAGE = 30;

const Breadcrumb = styled.div`
  padding: 0.25rem;
  color: ${({ active }) => (active ? "#fff" : colors.primary)};
  background-color: ${({ active }) => (active ? colors.primary : "#fff")};
  border-radius: ${borders.radius};

  display: flex;

  & > div:first-child {
    margin-right: 0.25rem;
  }
`;

const SidebarWrapper = styled.div`
  ul {
    list-style: none;
    margin: 0 0 1rem 0;
    padding: 0;
    word-break: keep-all;

    h4 {
      margin: 0;
    }

    li {
      padding: 0.25rem 0;
      border-bottom: #eee 1px solid;
      margin: 0.25rem 0;

      &.header {
        border-bottom-color: ${colors.primary};
      }
    }
  }
`;

/**
 * Renders all product categories
 * @returns {Component} The component
 */
class CategoriesSidebar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { active: window.location.pathname === props.match.url };
  }

  /**
   * Lifecycle method
   * @param {Object} prevProps The previous props
   * @returns {void}
   */
  componentDidUpdate = prevProps => {
    const {
      match: { url }
    } = this.props;

    this.setState({
      active:
        !window.location.pathname.startsWith("/produkte/") ||
        window.location.pathname === url
    });
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
      <SidebarWrapper>
        {categorySlug ? (
          <Link to={urlWithoutPage + "/1"}>
            <Breadcrumb active={active}>
              <div>⌄</div>
              <div>{category && category.name}</div>
            </Breadcrumb>
          </Link>
        ) : (
          <Link to="/">
            <Breadcrumb active={active}>
              <div>⌄</div>
              <div>Startseite</div>
            </Breadcrumb>
          </Link>
        )}

        {active && (
          <div>
            {categoryIds.length > 0 && (
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
            )}
            {productIds.length > 0 && (
              <ul>
                <li className="header">
                  <h4>Produkte</h4>
                </li>
                {productIds.map(productId => (
                  <ProductItem
                    key={productId}
                    id={productId}
                    parents={newParents}
                  />
                ))}

                {categoryIds.length === 0 &&
                  productIds.length === 0 &&
                  new Array(12).fill().map((el, index) => (
                    <li key={index} id={-1}>
                      <Placeholder text />
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}
        <Route
          path={`${urlWithoutPage}/:categorySlug/:page`}
          render={props => <RoutedSidebar {...props} parents={newParents} />}
        />
      </SidebarWrapper>
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
          .filter(product => product.categoryIds.includes(category.id))
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
  dispatch
});

const ConnectedSidebar = connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriesSidebar);

const RoutedSidebar = withRouter(ConnectedSidebar);

export default RoutedSidebar;
