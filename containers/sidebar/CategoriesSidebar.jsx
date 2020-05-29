import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import {
  getProducts,
  getProductCategoryChildrenIdsById,
  getProductCategoryBySlug,
} from "reducers";
import { FaChevronDown as ChevronDown } from "react-icons/fa";
import { useIntl } from "react-intl";

import CategoryItem from "../../containers/sidebar/CategoryItem";
import Link from "../../components/Link";
import SidebarListWrapper from "../../components/sidebar/SidebarListWrapper";
import SidebarBreadcrumb from "../../components/sidebar/SidebarBreadcrumb";
import { getLanguage } from "../../reducers";
import pageMessages from "../../i18n/page";
import product from "../../i18n/product";

const ITEMS_PER_PAGE = 60;

/**
 * Renders all product categories
 * @returns {Component} The component
 */

const CategoriesSidebar = React.memo(
  ({
    language,
    category,
    categoryIds,
    productIds,
    parents = [],
    location: { pathname },
    match: {
      params: { categorySlug, page },
      url,
    },
  }) => {
    const intl = useIntl();
    const categoryId = (category && category.id) || 0;

    //check if endings match
    const active = useMemo(
      () => pathname.substring(pathname.length - url.length) === url,
      [pathname, url]
    );

    const urlWithoutPage = useMemo(
      () => (page ? url.split("/").slice(0, -1).join("/") : url),
      [page, url]
    );

    const newParents = useMemo(
      () => (categorySlug ? [...parents, categorySlug] : []),
      [categorySlug, parents]
    );

    return (
      <SidebarListWrapper>
        {categorySlug ? (
          <Link to={urlWithoutPage + "/1"}>
            <SidebarBreadcrumb active={active}>
              <div>
                <ChevronDown />
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: category && category.name,
                }}
              />
            </SidebarBreadcrumb>
          </Link>
        ) : (
          <Link to={`/${language}/`}>
            <SidebarBreadcrumb active={active}>
              <div>
                <ChevronDown />
              </div>
              <div>{intl.formatMessage(pageMessages.home)}</div>
            </SidebarBreadcrumb>
          </Link>
        )}

        {active && (
          <div>
            {
              categoryIds.length > 0 ? (
                <ul>
                  <li className="header">
                    <h4>{intl.formatMessage(product.categories)}</h4>
                  </li>
                  {categoryIds.map((categoryId) => (
                    <CategoryItem
                      key={categoryId}
                      id={categoryId}
                      parents={newParents}
                    />
                  ))}
                </ul>
              ) : null /*<p>Keine weiteren Unterkategorien gefunden</p>*/
            }
          </div>
        )}
        <Route
          path={`${urlWithoutPage}/:categorySlug/:page`}
          render={(props) => <RoutedSidebar {...props} parents={newParents} />}
        />
      </SidebarListWrapper>
    );
  }
);

const mapStateToProps = (
  state,
  {
    match: {
      params: { categorySlug, page },
    },
  }
) => {
  const category = getProductCategoryBySlug(state, categorySlug);

  return {
    language: getLanguage(state),
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
            (product) =>
              product.categoryIds && product.categoryIds.includes(category.id)
          )
          .sort((a, b) => a.order - b.order)
          .map((product) => product.id)
          .slice(ITEMS_PER_PAGE * (page - 1), ITEMS_PER_PAGE * page)
      : [],
    page,
  };
};

const ConnectedSidebar = connect(mapStateToProps)(CategoriesSidebar);

const RoutedSidebar = withRouter(ConnectedSidebar);

export default RoutedSidebar;
