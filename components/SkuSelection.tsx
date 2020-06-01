import React, { useState, FunctionComponent } from "react";
import styled from "styled-components";
import ReactTable from "react-table";
import fuzzy from "fuzzy";
import get from "lodash/get";
import { defineMessages, injectIntl, useIntl } from "react-intl";
import debounce from "lodash/debounce";
import { FaCartPlus, FaTimesCircle } from "react-icons/fa";

import Button from "./elements/Button";
import { colors, media } from "../utilities/style";
import Price from "./elements/Price";
import { pathnamesByLanguage } from "../utilities/urls";
import productMessages from "../i18n/product";
import pagination from "../i18n/pagination";
import { trackSiteSearch } from "../utilities/analytics";
import StyledLink from "./elements/StyledLink";
import { Product, ProductVariant } from "../schema";

const messages = defineMessages({
  loading: {
    id: "SkuSelection.loading",
    defaultMessage: "Lade...",
  },
  noProductsFound: {
    id: "SkuSelection.noProductsFound",
    defaultMessage: "Keine Produkte gefunden",
  },
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
    &:last-child {
      flex: 0 0 36px !important;
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

const AddToCart = styled.div`
  margin-top: 1rem;
  display: flex;

  & > div {
    width: 100%;
    margin-left: 0.5rem;
  }
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
      extract: (e) =>
        typeof column.accessor === "function"
          ? column.accessor(e)
          : get(e, column.accessor),
    })
    .map((e) => e.original);

  if (filter.value.length > 0) {
    debouncedSearch(filter.value, results.length);
  }

  return results;
};

/**
 * The name cell
 */

const NameCell: FunctionComponent<{
  variant: ProductVariant;
  isExpanded: boolean;
}> = React.memo(({ variant, isExpanded }) => {
  const intl = useIntl();
  const [counter, setCounter] = useState(1);

  return (
    <div>
      <strong dangerouslySetInnerHTML={{ __html: variant.name }} />
      <div>
        META
        <br />
        <small>
          <span>
            <strong>{intl.formatMessage(productMessages.sku)}</strong>:{" "}
            {variant.sku}
          </span>
        </small>
        {isExpanded && (
          <AddToCart>
            <input
              type="text"
              value={counter}
              size={2}
              onChange={(e) => setCounter(parseInt(e.currentTarget.value))}
            />
            <Button
              fullWidth
              controlled
              state=""
              onClick={() => console.log("add")}
            >
              {intl.formatMessage(productMessages.addToCart)}
            </Button>
          </AddToCart>
        )}
      </div>
    </div>
  );
});

/**
 * The sku selection
 */

const SkuSelection: FunctionComponent<{
  query: string;
  variants: ProductVariant[];
}> = ({ query, variants }) => {
  const intl = useIntl();
  const isFetching = false;

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
            },
          },
          {
            id: "name",
            Header: intl.formatMessage(productMessages.name),
            accessor: (e: ProductVariant) => e.name /** meta */ + " " + e.sku,
            minWidth: 150,
            filterAll: true,
            filterMethod: fuzzyFilter,
            Cell: ({ row: { _original: variant }, isExpanded }) => (
              <NameCell variant={variant} isExpanded={isExpanded} />
            ),
          },
          {
            id: "price",
            Header: intl.formatMessage(productMessages.price),
            accessor: (variant: ProductVariant) => variant.price,
            filterable: false,
            minWidth: 150,
            Cell: ({ row: { _original: variant }, isExpanded }) => (
              <div>
                {variant.discount &&
                variant.discount.bulk &&
                variant.discount.bulk.length > 0 ? (
                  isExpanded ? (
                    <div>
                      <BulkDiscountTable>
                        <thead>
                          <tr>
                            <th>
                              {intl.formatMessage(productMessages.pieces)}
                            </th>
                            <th>{intl.formatMessage(productMessages.price)}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1 x</td>
                            <td>
                              <Price>{variant.price}</Price>
                            </td>
                          </tr>
                          {variant.discount.bulk.map(
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
                      <Price>{variant.price}</Price>
                      <br />
                      {intl.formatMessage(productMessages.withBulkDiscount)}
                    </div>
                  )
                ) : variant.discount && variant.discount.reseller ? (
                  <div>
                    <del>
                      <Price>{variant.price}</Price>
                    </del>
                    <br />
                    <ins>
                      <Price>
                        {(variant.price * variant.discount.reseller) / 100}
                      </Price>
                    </ins>
                    <br />
                    <small>
                      {variant.discount.reseller}% Rabatt als Wiederverkäufer
                    </small>
                  </div>
                ) : (
                  <div>
                    <Price>{variant.price}</Price>
                  </div>
                )}
              </div>
            ),
          },
          {
            Header: "",
            width: 36,
            expander: true,
            Expander: ({ isExpanded, ...rest }) => (
              <div>
                {isExpanded ? (
                  <span>
                    <FaTimesCircle size={24} />
                  </span>
                ) : (
                  <span>
                    <FaCartPlus size={24} />
                  </span>
                )}
              </div>
            ),
          },
        ]}
        data={variants}
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

export default SkuSelection;
