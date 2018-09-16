import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import ChevronDown from "react-icons/lib/fa/chevron-down";

import Link from "../../components/Link";
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
            <div>
              <ChevronDown />
            </div>
            <div>Startseite</div>
          </SidebarBreadcrumb>
        </Link>
        <hr />
        {categories.map(category => [
          ...category.parents.map((category, index) => (
            <Link
              key={category.id}
              to={
                "/produkt-kategorie/" +
                (index > 0
                  ? category.parents
                      .slice(0, index)
                      .map(category => category.slug)
                      .join("/") + "/"
                  : "") +
                category.slug +
                "/1"
              }
            >
              <SidebarBreadcrumb active={false}>
                <div>
                  <ChevronDown />
                </div>
                <div dangerouslySetInnerHTML={{ __html: category.name }} />
              </SidebarBreadcrumb>
            </Link>
          )),
          <Link
            key={category.id}
            to={
              "/produkt-kategorie/" +
              (category.parents.length > 0
                ? category.parents.map(category => category.slug).join("/") +
                  "/"
                : "") +
              category.slug +
              "/1"
            }
          >
            <SidebarBreadcrumb active={false}>
              <div>
                <ChevronDown />
              </div>
              <div dangerouslySetInnerHTML={{ __html: category.name }} />
            </SidebarBreadcrumb>
          </Link>,
          <hr key="0" />
        ])}

        <SidebarBreadcrumb active={true}>
          <div />
          <div dangerouslySetInnerHTML={{ __html: product.title }} />
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
      product && !product._isFetching && product.categoryIds
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
