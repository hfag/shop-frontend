import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";

import Thumbnail from "../../containers/Thumbnail";
import Placeholder from "../../components/Placeholder";
import Link from "../../components/Link";
import { colors, borders, shadows } from "../../utilities/style";
import {
  getProductCategories,
  getProductBySlug,
  getProductCategoryById
} from "../../reducers";
import SidebarListWrapper from "../../components/sidebar/SidebarListWrapper";
import SidebarBreadcrumb from "../../components/sidebar/SidebarBreadcrumb";
/**
 * Renders a single product item
 * @returns {Component} The component
 */
class ProductSidebar extends React.PureComponent {
  render = () => {
    const { id: productId, product, categories } = this.props;

    return (
      <SidebarListWrapper>
        <Link to="/">
          <SidebarBreadcrumb active={false}>
            <div>⌄</div>
            <div>Startseite</div>
          </SidebarBreadcrumb>
        </Link>
        <hr />
        {categories.map(category => [
          ...category.parents.map(category => (
            <Link key={category.id} to={"/produkte/" + category.slug}>
              <SidebarBreadcrumb active={false}>
                <div>⌄</div>
                <div>{category.name}</div>
              </SidebarBreadcrumb>
            </Link>
          )),
          <Link key={category.id} to={"/produkte/" + category.slug}>
            <SidebarBreadcrumb active={false}>
              <div>⌄</div>
              <div>{category.name}</div>
            </SidebarBreadcrumb>
          </Link>,
          <hr />
        ])}

        <SidebarBreadcrumb active={true}>
          <div />
          <div>{product.title}</div>
        </SidebarBreadcrumb>

        <hr />
      </SidebarListWrapper>
    );
  };
}

ProductSidebar.propTypes = {};

const mapStateToProps = (
  state,
  {
    match: {
      params: { productSlug }
    }
  }
) => {
  const product = getProductBySlug(state, productSlug);
  return {
    productSlug,
    product: product && !product._isFetching ? product : {},
    categories:
      product && !product._isFetching
        ? getProductCategories(state)
            .filter(category => product.categoryIds.includes(category.id))
            .map(category => {
              const parents = [];

              let current = category;

              while (current.parent) {
                parents.push(getProductCategoryById(state, current.parent));
                current = parents[parents.length - 1];
              }

              return { ...category, parents };
            })
        : []
  };
};

export default connect(mapStateToProps)(ProductSidebar);
