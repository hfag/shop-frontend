import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { defineMessages, injectIntl } from "react-intl";
import { FaChevronDown as ChevronDown } from "react-icons/fa";

import Link from "../../components/Link";
import {
  getProductCategories,
  getProductBySlug,
  getProductCategoryById,
  getLanguage
} from "../../reducers";
import SidebarListWrapper from "../../components/sidebar/SidebarListWrapper";
import SidebarBreadcrumb from "../../components/sidebar/SidebarBreadcrumb";
import { pathnamesByLanguage } from "../../utilities/urls";
import page from "../../i18n/page";

const ProductSidebar = React.memo(
  injectIntl(({ language, id: productId, product, categories, intl }) => {
    return (
      <SidebarListWrapper>
        <Link to={`/${language}/`}>
          <SidebarBreadcrumb active={false}>
            <div>
              <ChevronDown />
            </div>
            <div>{intl.formatMessage(page.home)}</div>
          </SidebarBreadcrumb>
        </Link>
        <hr />
        {categories.map(category => [
          ...category.parents.map((category, index) => (
            <Link
              key={category.id}
              to={`/${language}/${
                pathnamesByLanguage[language].productCategory
              }/${
                index > 0
                  ? category.parents
                      .slice(0, index)
                      .map(category => category.slug)
                      .join("/") + "/"
                  : ""
              }${category.slug}/1`}
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
            to={`/${language}/${
              pathnamesByLanguage[language].productCategory
            }/${
              category.parents.length > 0
                ? category.parents.map(category => category.slug).join("/") +
                  "/"
                : ""
            }${category.slug}/1`}
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
  })
);

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
    language: getLanguage(state),
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
                parents.push(
                  getProductCategoryById(state, current.parent) || {}
                );
                current = parents[parents.length - 1];
              }

              return { ...category, parents };
            })
        : []
  };
};

export default connect(mapStateToProps)(ProductSidebar);
