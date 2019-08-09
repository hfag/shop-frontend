import React from "react";
import styled from "styled-components";

import { colors, borders, shadows } from "../utilities/style";
import Price from "./Price";
import Link from "./Link";
import { pathnamesByLanguage } from "../utilities/urls";

const OrderWrapper = styled.div`
  margin-top: -1px; /*border*/
  padding: 1rem;
  border: #eee 1px solid;
  border-radius: ${borders.radius};

  h4,
  h5 {
    margin: 0;
  }
`;

const Status = styled.div`
  display: inline-block;
  background-color: ${({ color }) => color};
  color: #fff;

  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 0.125rem 0.25rem;
`;

const OrderItem = styled.div`
  margin: 0.5rem 0 1rem 0;
`;
const OrderMeta = styled.div``;

/**
 * Gets the state object based on the wc status
 * @param {string} status The woocommerce status string
 * @returns {Object} The state object
 */
const getState = status => {
  switch (status) {
    case "wc-pending":
      return { color: colors.info, label: "Bezahlung ausstehend" };
    case "wc-on-hold":
      return { color: colors.info, label: "In Warteschlange" };
    case "wc-processing":
      return { color: colors.info, label: "In Bearbeitung" };
    case "wc-completed":
      return { color: colors.success, label: "Abgeschlossen" };
    case "wc-on-refunded":
      return { color: colors.warning, label: "Zurückerstattet" };
    case "wc-on-cancelled":
      return { color: colors.danger, label: "Storniert" };
    case "wc-on-failed":
    default:
      return { color: colors.danger, label: "Fehlgeschlagen" };
  }
};

/**
 * An order component
 * @returns {Component} The component
 */
class Order extends React.PureComponent {
  render = () => {
    const {
      order: {
        id,
        title,
        billing,
        shipping,
        items,
        comment,
        total,
        status,
        created
      },
      compact = false
    } = this.props;

    const date = new Date(created * 1000);
    const state = getState(status);

    return (
      <OrderWrapper>
        <Link
          to={`/${language}/${pathnamesByLanguage[language].account}/${pathnamesByLanguage[language].orders}/${id}`}
          styled
        >
          <h4>
            Bestellung #{id} vom {date.toLocaleDateString()}
          </h4>
        </Link>
        {compact ? (
          <div>
            {items.length} Produkte für <Price>{total}</Price>
          </div>
        ) : (
          <div>
            {items.map((item, index) => (
              <OrderItem key={index}>
                <h5>
                  {item.name} ({item.sku})
                </h5>
                <OrderMeta>
                  {Object.keys(item.attributes).map((key, index) => (
                    <span key={index}>
                      <strong>{key}</strong>: {item.attributes[key]}
                    </span>
                  ))}
                </OrderMeta>
              </OrderItem>
            ))}
            <Price>{total}</Price>
          </div>
        )}
        <div>
          <Status color={state.color}>{state.label}</Status>
        </div>
      </OrderWrapper>
    );
  };
}

export default Order;
