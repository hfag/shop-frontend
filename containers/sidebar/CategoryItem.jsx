import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Placeholder from "../../components/Placeholder";
import Link from "../../components/Link";
import { getProductCategoryById, getLanguage } from "../../reducers";
import { colors, borders, shadows } from "../../utilities/style";
import { pathnamesByLanguage } from "../../utilities/urls";

/**
 * A single category item
 * @returns {Component} The component
 */
class CategoryItem extends React.PureComponent {
  render = () => {
    const {
      language,
      id: categoryId,
      category,
      parent,
      parents = []
    } = this.props;

    if (category && !category.count) {
      return null;
    }

    return (
      <li>
        <Link
          to={
            category
              ? `/${language}/${
                  pathnamesByLanguage[language].productCategory
                }/${parents.length > 0 ? parents.join("/") + "/" : ""}${
                  category.slug
                }/1`
              : ""
          }
        >
          <div>
            {category ? (
              <span dangerouslySetInnerHTML={{ __html: category.name }} />
            ) : (
              <Placeholder text height={2} />
            )}
          </div>
        </Link>
      </li>
    );
  };
}

CategoryItem.propTypes = {
  id: PropTypes.number.isRequired,
  parents: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = (state, { id }) => {
  const category = getProductCategoryById(state, id);

  return category
    ? {
        language: getLanguage(state),
        category,
        parent: category.parent
          ? getProductCategoryById(state, category.parent)
          : undefined
      }
    : { language: getLanguage(state) };
};

const mapDispatchToProps = (dispatch, { id }) => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryItem);
