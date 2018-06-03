import React from "react";
import { connect } from "react-redux";
import Link from "components/Link";
import Placeholder from "components/Placeholder";
import Keyer from "containers/breadcrumbs/Keyer";
import Breadcrumb from "containers/breadcrumbs/Breadcrumb";
import { getProductCategoryById, getProductCategoryBySlug } from "reducers";

/**
 * Renders the category breadcrumb
 * @returns {Component} The component
 */
class CategoryBreadcrumb extends React.PureComponent {
  render = () => {
    const { categories } = this.props;

    return categories.length > 0 ? 
      categories.map((cat, index) => 
        <Keyer key={cat ? cat.slug : index}>
          <Breadcrumb>
            <Link to={"/produkte/" + cat.slug + "/1"}>{cat.name}</Link>
          </Breadcrumb>
        </Keyer>
      )
     : 
      <Placeholder text inline minWidth={5} />
    ;
  };
}

const mapStateToProps = (state, { match: { url } }) => {
  const slugs = window.location.pathname.replace(url, "").split("/");
  slugs.shift();
  if (!isNaN(slugs[slugs.length - 1])) {
    slugs.pop();
  }
  const categories = slugs
    .map(slug => getProductCategoryBySlug(state, slug))
    .filter(c => c);

  return {
    categories
  };
};

export default connect(mapStateToProps)(CategoryBreadcrumb);
