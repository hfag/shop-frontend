import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Flex, Box } from "grid-styled";
import { FaPercent } from "react-icons/fa";
import { withRouter } from "react-router";

import Thumbnail from "../containers/Thumbnail";
import Placeholder from "../components/Placeholder";
import Link from "../components/Link";
import { colors, borders, shadows } from "../utilities/style";
import { fetchProductIfNeeded } from "../actions/product";
import {
  getProductCategories,
  getProductBySlug,
  getProductById,
  getResellerDiscountByProductId
} from "../reducers";
import RelativeBox from "../components/RelativeBox";
import Price from "../components/Price";
import { getUrlPartByKeyAndLanguage } from "../utilities/urls";
import { getLanguageFromLocation } from "../utilities/i18n";

const StyledProduct = styled.div`
  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};

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
  word-break: break-word;
  hyphens: auto;
`;

const Subtitle = styled.span`
  color: ${colors.fontLight};
  font-size: 0.8rem;
  word-break: break-word;
  hyphens: auto;
`;

const Discount = styled.div`
  position: absolute !important;
  top: -0.5rem;
  right: 0rem;
  width: 2rem;
  height: 2rem;

  padding: 0.25rem;
  text-align: center;
  line-height: 1.25rem;

  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};

  z-index: 2;
`;

const ProductItem = React.memo(
  ({
    product,
    categories,
    resellerDiscount,
    fetchProductIfNeeded,
    location
  }) => {
    /*useEffect(
      () => {
        fetchProductIfNeeded(product.slug); we don't need to fetch the whole product, just a preview
      },
      [product.slug]
    );*/

    const url = useMemo(
      () => {
        if (product && product.slug) {
          const language = getLanguageFromLocation(location);
          const base = getUrlPartByKeyAndLanguage("product", language);

          return `/${language}/${base}/${product.slug}/`;
        }

        return "";
      },
      [product, location]
    );

    return (
      <RelativeBox width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]} px={2} pb={3}>
        {resellerDiscount && (
          <Discount
            data-balloon={`${resellerDiscount}% Rabatt für Wiederverkäufer`}
            data-balloon-pos="up"
          >
            <FaPercent />
          </Discount>
        )}
        <Link to={url}>
          <StyledProduct>
            <Thumbnail id={product ? product.thumbnailId : -1} />
            <div>
              {product ? (
                <Title dangerouslySetInnerHTML={{ __html: product.title }} />
              ) : (
                <Placeholder text />
              )}
              {product.minPrice && (
                <div>
                  <Subtitle>
                    Ab{" "}
                    <u>
                      <Price>{parseInt(product.minPrice)}</Price>
                    </u>
                  </Subtitle>
                </div>
              )}
              {product ? (
                categories ? (
                  categories
                    .map(category => (
                      <Subtitle
                        key={category.id}
                        dangerouslySetInnerHTML={{ __html: category.name }}
                      />
                    ))
                    .slice(0, 2)
                    .reduce(
                      (all, item) => (all ? [...all, ", ", item] : [item]),
                      false
                    )
                ) : (
                  ""
                )
              ) : (
                <Placeholder text />
              )}
              {product && categories && categories.length > 2 && (
                <span>, ...</span>
              )}
            </div>
          </StyledProduct>
        </Link>
      </RelativeBox>
    );
  }
);

ProductItem.propTypes = {
  id: PropTypes.number.isRequired,
  parents: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = (state, { id }) => {
  const product = getProductById(state, id);

  return product && product.categoryIds
    ? {
        product,
        categories: getProductCategories(state).filter(category =>
          product.categoryIds.includes(category.id)
        ),
        resellerDiscount: getResellerDiscountByProductId(state, id)
      }
    : {};
};

const mapDispatchToProps = dispatch => ({
  /**
   * Fetches a product
   * @param {string} slug The product's slug
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProductIfNeeded(slug, visualize = true) {
    return dispatch(fetchProductIfNeeded(slug, visualize));
  }
});

const ConnectedProductItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductItem);

export default withRouter(ConnectedProductItem);
