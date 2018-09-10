import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Placeholder from "../../components/Placeholder";
import Link from "../../components/Link";
import { getProductCategoryById } from "../../reducers";
import { colors, borders, shadows } from "../../utilities/style";

/**
 * A single category item
 * @returns {Component} The component
 */
class CategoryItem extends React.PureComponent {
  render = () => {
    const { id: categoryId, category, parent, parents = [] } = this.props;

    if (category && !category.count) {
      return null;
    }

    return (
      <li>
        <Link
          to={
            category
              ? "/produkte/" +
                (parents.length > 0 ? parents.join("/") + "/" : "") +
                category.slug +
                "/1"
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
        category,
        parent: category.parent
          ? getProductCategoryById(state, category.parent)
          : undefined
      }
    : {};
};

const mapDispatchToProps = (dispatch, { id }) => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryItem);
