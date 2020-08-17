import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import fuzzy from "fuzzy";
import get from "lodash/get";
import { defineMessages, injectIntl, useIntl } from "react-intl";
import debounce from "lodash/debounce";
import { FaCartPlus, FaTimesCircle } from "react-icons/fa";

import Button from "../components/Button";
import { addShoppingCartItem } from "../actions/shopping-cart";
import {
  fetchSimpleProducts,
  clearSimpleProducts
} from "../actions/product/simple";
import {
  getSimpleProducts,
  getResellerDiscount,
  isFetchingSimpleProducts,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import { colors, media } from "../utilities/style";
import Price from "../components/Price";
import Link from "../components/Link";
import { pathnamesByLanguage } from "../utilities/urls";
import productMessages from "../i18n/product";
import pagination from "../i18n/pagination";
import { trackSiteSearch } from "../utilities/analytics";

const messages = defineMessages({
  loading: {
    id: "SkuSelection.loading",
    defaultMessage: "Lade..."
  },
  noProductsFound: {
    id: "SkuSelection.noProductsFound",
    defaultMessage: "Keine Produkte gefunden"
  }
});

const SkuSelectionWrapper = styled.div`
  h2 {
    margin-top: 0;
  }
`;

const StyledTable = styled(ReactTable)`
  div.rt-thead.-header {
    box-shadow: none;
    border-bottom: #ccc 1px solid;
  }

  .rt-td:nth-child(3) {
    text-align: right;
  }

  .rt-thead.-filters .rt-tr input {
    border-radius: 0;
  }

  div.rt-td,
  div.rt-th {
    white-space: normal;
    width: auto !important;

    &:first-child {
      flex: 1 0 20% !important;
      word-break: break-all;
      hyphens: auto;
    }
    &:nth-child(2) {
      flex: 2 1 60% !important;
    }
    &:nth-child(3) {
      flex: 1 0 20% !important;
    }
  }

  ${media.maxSmall`
  div.rt-td:first-child, div.rt-th:first-child, div.rt-td:nth-child(3), div.rt-th:nth-child(3), div.rt-td:last-child, div.rt-th:last-child {
      flex: 0 0 0 !important;
      display: none;
    }
  `}
`;

const BulkDiscountTable = styled.table`
  width: 100%;
`;

const debouncedSearch = debounce((keyword, resultCount) => {
  trackSiteSearch(keyword, false, resultCount);
}, 300);

/**
 * Filters data rows
 * @param {Object} filter The filter object
 * @param {Array<Object>} rows All data rows
 * @param {Object} column The column
 * @returns {Array<boolean>} An array of booleans indicating what items should be displayed
 */
const fuzzyFilter = (filter, rows, column) => {
  const results = fuzzy
    .filter(filter.value, rows, {
      pre: "<strong>",
      post: "</strong>",
      extract: e =>
        typeof column.accessor === "function"
          ? column.accessor(e)
          : get(e, column.accessor)
    })
    .map(e => e.original);

  if (filter.value.length > 0) {
    debouncedSearch(filter.value, results.length);
  }

  return results;
};

/**
 * The name cell
 * @returns {Component} The name cell
 */

const NameCell = React.memo(
  ({ language, product, isExpanded, addToShoppingCart }) => {
    const intl = useIntl();
    const [counter, setCounter] = useState(1);

    return (
      <div>
        <Link
          to={`/${language}/${pathnamesByLanguage[language].product}/${product.slug}/?variationId=${product.variationId}`}
        >
          <strong dangerouslySetInnerHTML={{ __html: product.name }} />
        </Link>
        <div>
          {product.meta && (
            <small>
              {Object.keys(product.meta)
                .map((key, index) => (
                  <span key={index}>
                    <strong>{key}</strong>: {product.meta[key]}
                  </span>
                ))
                .reduce((prev, curr) => [prev, ", ", curr])}
            </small>
          )}
          <br />
          <small>
            <span>
              <strong>{intl.formatMessage(productMessages.sku)}</strong>:{" "}
              {product.sku}
            </span>
          </small>
          {isExpanded && (
            <AddToCart>
              <input
                type="text"
                value={counter}
                size="2"
                onChange={e => setCounter(e.currentTarget.value)}
              />
              <Button
                fullWidth
                controlled
                state=""
                onClick={() =>
                  addToShoppingCart(
                    product.id,
                    product.variationId,
                    product.meta,
                    counter,
                    product.sku,
                    product.title,
                    product.minPrice
                  )
                }
              >
                {intl.formatMessage(productMessages.addToCart)}
              </Button>
            </AddToCart>
          )}
        </div>
      </div>
    );
  }
);

/**
 * The sku selection
 * @returns {Component} The component
 */
class SkuSelection extends React.PureComponent {
  componentDidMount = () => {
    const { products, fetchSimpleProducts, isFetching, dispatch } = this.props;

    if (!isFetching && products.length === 0) {
      fetchSimpleProducts();
    }
  };

  componentWillUnmount = () => {
    const { clearSimpleProducts } = this.props;
    //clearSimpleProducts();
  };

  render = () => {
    const {
      language,
      query = "",
      products,
      addToShoppingCart,
      isFetching,
      intl
    } = this.props;

    return (
      <SkuSelectionWrapper>
        <StyledTable
          loading={isFetching}
          columns={[
            {
              Header: intl.formatMessage(productMessages.sku),
              accessor: "sku",
              minWidth: 150,
              filterMethod: (filter, row, column) => {
                const id = filter.pivotId || filter.id;
                return row[id] !== undefined
                  ? String(row[id])
                      .toLocaleLowerCase()
                      .startsWith(filter.value.toLocaleLowerCase())
                  : true;
              }
            },
            {
              id: "name",
              Header: intl.formatMessage(productMessages.name),
              accessor: e =>
                e.name +
                (e.meta
                  ? " " +
                    Object.keys(e.meta)
                      .map(key => `${key}: ${e.meta[key]}`)
                      .join(" ")
                  : "") +
                " " +
                e.sku,
              minWidth: 150,
              filterAll: true,
              filterMethod: fuzzyFilter,
              Cell: ({ row: { _original: product }, isExpanded }) => (
                <NameCell
                  language={language}
                  product={product}
                  isExpanded={isExpanded}
                  addToShoppingCart={addToShoppingCart}
                />
              )
            },
            {
              id: "price",
              Header: intl.formatMessage(productMessages.price),
              accessor: product =>
                product.discount && product.discount.reseller
                  ? (product.price * product.discount.reseller) / 100
                  : product.price,
              filterable: false,
              minWidth: 150,
              Cell: ({ row: { _original: product }, isExpanded }) => (
                <div>
                  {product.discount &&
                  product.discount.bulk &&
                  product.discount.bulk.length > 0 ? (
                    isExpanded ? (
                      <div>
                        <BulkDiscountTable>
                          <thead>
                            <tr>
                              <th>
                                {intl.formatMessage(productMessages.pieces)}
                              </th>
                              <th>
                                {intl.formatMessage(productMessages.price)}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1 x</td>
                              <td>
                                <Price>{product.price}</Price>
                              </td>
                            </tr>
                            {product.discount.bulk.map(
                              ({ qty: quantity, ppu: pricePerUnit }, index) => (
                                <tr key={index}>
                                  <td>{quantity} x</td>
                                  <td>
                                    <Price>{pricePerUnit}</Price>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </BulkDiscountTable>
                      </div>
                    ) : (
                      <div>
                        <Price>{product.price}</Price>
                        <br />
                        {intl.formatMessage(productMessages.withBulkDiscount)}
                      </div>
                    )
                  ) : product.discount.reseller ? (
                    <div>
                      <del>
                        <Price>{product.price}</Price>
                      </del>
                      <br />
                      <ins>
                        <Price>
                          {(product.price * product.discount.reseller) / 100}
                        </Price>
                      </ins>
                      <br />
                      <small>
                        {product.discount.reseller}% Rabatt als Wiederverkäufer
                      </small>
                    </div>
                  ) : (
                    <div>
                      <Price>{product.price}</Price>
                    </div>
                  )}
                </div>
              )
            }
          ]}
          data={products}
          pageSizeOptions={[5, 10, 20, 25, 50, 100]}
          defaultPageSize={5}
          minRows={2}
          resizable={false}
          filterable
          defaultResized={[{ id: "expander", value: 50 }]}
          defaultFiltered={[{ id: "name", value: query }]}
          previousText={intl.formatMessage(pagination.previous)}
          nextText={intl.formatMessage(pagination.next)}
          loadingText={intl.formatMessage(messages.loading)}
          noDataText={intl.formatMessage(messages.noProductsFound)}
          pageText={intl.formatMessage(pagination.page)}
          ofText={intl.formatMessage(pagination.of)}
          rowsText={intl.formatMessage(pagination.rows)}
        />
      </SkuSelectionWrapper>
    );
  };
}

SkuSelection.propTypes = {
  query: PropTypes.string
};

const mapStateToProps = state => {
  const products = getSimpleProducts(state),
    resellerDiscount = getResellerDiscount(state);

  return {
    language: getLanguage(state),
    languageFetchString: getLanguageFetchString(state),
    products: products.map(product =>
      resellerDiscount[product.id]
        ? {
            ...product,
            discount: {
              ...product.discount,
              reseller: resellerDiscount[product.id]
            }
          }
        : product
    ),
    isFetching: isFetchingSimpleProducts(state)
  };
};
const mapDispatchToProps = dispatch => ({
  dispatch,
  /**
   * Clears all simple products
   * @returns {void}
   */
  clearSimpleProducts() {
    return dispatch(clearSimpleProducts());
  },
  /**
   * Fetches all simple products
   * @param {string} language The language string
   * @param {boolean} [visualize=true] Whether the action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchSimpleProducts(language, visualize = false) {
    return dispatch(fetchSimpleProducts(language, visualize));
  },
  /**
   * Updates the shopping cart
   * @param {number|string} productId The product id
   * @param {number|string} [variationId] The variation id
   * @param {Object} [variation] The variation attributes
   * @param {number} [quantity=1] The quantity
   * @param {string} sku The product sku
   * @param {string} productName The product name
   * @param {number} minPrice The min price
   * @param {string} language The language string
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {function} The redux thunk
   */
  addToShoppingCart(
    productId,
    variationId,
    variation,
    quantity = 1,
    sku,
    productName,
    minPrice,
    language,
    visualize = true
  ) {
    return dispatch(
      addShoppingCartItem(
        productId,
        variationId,
        variation,
        quantity,
        { sku, productName, minPrice },
        language,
        visualize
      )
    );
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches all simple products
   * @param {boolean} [visualize=true] Whether the action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchSimpleProducts(visualize = false) {
    return mapDispatchToProps.fetchSimpleProducts(
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Updates the shopping cart
   * @param {number|string} productId The product id
   * @param {number|string} [variationId] The variation id
   * @param {Object} [variation] The variation attributes
   * @param {number} [quantity=1] The quantity
   * @param {string} sku The product sku
   * @param {string} productName The product name
   * @param {number} minPrice The min price
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {function} The redux thunk
   */
  addToShoppingCart(
    productId,
    variationId,
    variation,
    quantity = 1,
    sku,
    productName,
    minPrice,
    visualize = true
  ) {
    return mapDispatchToProps.addToShoppingCart(
      productId,
      variationId,
      variation,
      quantity,
      mapStateToProps.languageFetchString,
      visualize
    );
  }
});

const TranslatedSkuSelection = injectIntl(SkuSelection);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TranslatedSkuSelection);
