import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import FaPercent from "react-icons/lib/fa/percent";

import Thumbnail from "../../containers/Thumbnail";
import Placeholder from "../../components/Placeholder";
import Link from "../../components/Link";
import { colors, borders, shadows } from "../../utilities/style";
import {
  getProductCategories,
  getProductBySlug,
  getProductById,
  getResellerDiscountByProductId
} from "../../reducers";

const Discount = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  font-size: 0.7rem;
  line-height: 0.8rem;

  padding: 0.25rem;
  margin-left: 0.25rem;
  text-align: center;

  background-color: ${colors.primary};
  border-radius: 50%;
  color: #fff;

  display: inline-block;

  z-index: 2;
`;

/**
 * Renders a single product item
 * @returns {Component} The component
 */
class ProductItem extends React.PureComponent {
  render = () => {
    const {
      id: productId,
      product,
      categories,
      parents = [],
      resellerDiscount
    } = this.props;

    return (
      <li>
        <Link to={"/produkt/" + product.slug}>
          <div>
            {product ? product.title : <Placeholder text />}
            {resellerDiscount && (
              <Discount
                data-balloon={`${resellerDiscount}% Rabatt für Wiederverkäufer`}
                data-balloon-pos="up"
              >
                <FaPercent />
              </Discount>
            )}
          </div>
        </Link>
      </li>
    );
  };
}

ProductItem.propTypes = {
  id: PropTypes.number.isRequired,
  parents: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = (state, { id }) => {
  const product = getProductById(state, id);

  return product
    ? {
        product,
        categories: getProductCategories(state).filter(category =>
          product.categoryIds.includes(category.id)
        ),
        resellerDiscount: getResellerDiscountByProductId(state, id)
      }
    : {};
};

const mapDispatchToProps = (dispatch, { id }) => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductItem);
