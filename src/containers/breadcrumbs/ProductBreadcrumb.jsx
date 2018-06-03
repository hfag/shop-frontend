import React from "react";
import { connect } from "react-redux";
import Link from "components/Link";
import Placeholder from "components/Placeholder";
import Keyer from "containers/breadcrumbs/Keyer";
import Breadcrumb from "containers/breadcrumbs/Breadcrumb";
import { getProductCategoryById, getProductBySlug } from "reducers";

/**
 * Renders a product breadcrumb
 * @returns {Component} The component
 */
class ProductBreadcrumb extends React.PureComponent {
  render = () => {
    const {
      slug,
      product: { id, title },
      parents,
      match
    } = this.props;

    return typeof title === "string" ? 
      [
        ...parents.reverse().map(cat => 
          <Keyer key={cat.id}>
            <Breadcrumb>
              <Link to={"/produkte/" + cat.slug + "/1"}>{cat.name}</Link>
            </Breadcrumb>
          </Keyer>
        ),
        <Keyer key={slug}>
          <Breadcrumb>
            <Link to={"/produkte/" + slug}>{title}</Link>
          </Breadcrumb>
        </Keyer>
      ]
     : 
      <Placeholder text inline minWidth={5} />
    ;
  };
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { productSlug }
    }
  }
) => {
  const product = getProductBySlug(state, productSlug) || {};

  const category =
    getProductCategoryById(
      state,
      product.categoryIds ? product.categoryIds[0] : -1
    ) || {};
  const parents =
    product.categoryIds && getProductCategoryById(state, product.categoryIds[0])
      ? [getProductCategoryById(state, product.categoryIds[0])]
      : [];

  let current = category;

  while (current.parent) {
    parents.push(getProductCategoryById(state, current.parent));
    current = parents[parents.length - 1];
  }

  return {
    slug: productSlug,
    product,
    parents
  };
};

export default connect(mapStateToProps)(ProductBreadcrumb);
