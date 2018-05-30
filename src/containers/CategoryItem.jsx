import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Flex, Box } from "grid-styled";
import Thumbnail from "containers/Thumbnail";
import Placeholder from "components/Placeholder";
import Link from "components/Link";
import { colors, shadows } from "utilities/style";
import { fetchProductCategory } from "actions/product/categories";
import { getProductCategoryById } from "reducers";

const StyledCategory = styled.div`
  background-color: #fff;
  box-shadow: ${shadows.y};

  /*display: flex; See https://bugzilla.mozilla.org/show_bug.cgi?id=958714*/
  flex-direction: column;
  height: 100%;

  & > div:first-child {
    position: relative;
    border-bottom: ${colors.background} 1px solid;
    padding-top: 100%;

    & > * {
      position: absolute;
      top: 50%;
      left: 50%;

      width: 90%;
      height: 90%;

      transform: translate(-50%, -50%);

      &.b-height {
        height: 90%;
        width: auto;
      }

      &.b-width {
        width: 90%;
        height: auto;
      }
    }
  }

  & > div:last-child {
    flex: 1 0 auto;
  }

  & > div {
    padding: 0.5rem;
  }
`;

const Title = styled.div`
  font-weight: 500;
`;

const Subtitle = styled.div`
  color: ${colors.fontLight};
  font-size: 0.8rem;
`;

/**
 * A single category item
 * @returns {Component} The component
 */
class CategoryItem extends React.PureComponent {
  componentWillMount = () => {
    const { id, category, fetchProductCategory } = this.props;

    if (id > 0 && !category) {
      fetchProductCategory();
    }
  };

  render = () => {
    const { id: categoryId, category, parent } = this.props;

    if (category && !category.count) {
      return null;
    }

    return (
      <Box width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]} px={2} pb={3}>
        <Link to={"/category/" + categoryId + "/1"}>
          <StyledCategory>
            <Thumbnail id={category ? category.thumbnailId : -1} />
            <div>
              {category ? <Title>{category.name}</Title> : <Placeholder text />}
              {category ? (
                parent ? (
                  <Subtitle>{parent.name}</Subtitle>
                ) : (
                  ""
                )
              ) : (
                <Placeholder text />
              )}
            </div>
          </StyledCategory>
        </Link>
      </Box>
    );
  };
}

CategoryItem.propTypes = {
  id: PropTypes.number.isRequired
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
  /**
   * Fetches the product category
   * @returns {Promise} The fetch promise
   */
  fetchProductCategory() {
    return dispatch(fetchProductCategory(id));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryItem);
