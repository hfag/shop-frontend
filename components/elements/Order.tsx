import React, { FunctionComponent } from "react";
import styled from "styled-components";

import { colors, borders, shadows } from "../../utilities/style";
import Price from "../elements/Price";
import StyledLink from "../elements/StyledLink";
import { Order as OrderType } from "../../schema";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useIntl } from "react-intl";

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

const Status = styled.div<{ color: string }>`
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
const getState = (status) => {
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
 */
const Order: FunctionComponent<{ order: OrderType; compact?: boolean }> = ({
  order,
  compact,
}) => {
  const intl = useIntl();
  const date = new Date(order.createdAt);
  const state = getState(status);
  /* TODO: translate */

  return (
    <OrderWrapper>
      <StyledLink
        href={`/${language}/${pathnamesByLanguage.account[intl.locale]}/${
          pathnamesByLanguage.orders[intl.locale]
        }/${id}`}
        underlined
      >
        <h4>
          Bestellung #{id} vom {date.toLocaleDateString()}
        </h4>
      </StyledLink>
      {compact ? (
        <div>
          {order.lines.reduce((sum, l) => sum + l.quantity, 0)} Produkte für{" "}
          <Price>{order.total}</Price>
        </div>
      ) : (
        <div>
          {order.lines.map((line, index) => (
            <OrderItem key={index}>
              <h5>
                {line.productVariant.name} ({line.productVariant.sku})
              </h5>
              <OrderMeta>
                {line.productVariant.options.map((option, index) => (
                  <span key={index}>
                    <span
                      dangerouslySetInnerHTML={{ __html: option.name }}
                    ></span>
                  </span>
                ))}
              </OrderMeta>
            </OrderItem>
          ))}
          <Price>{order.total}</Price>
        </div>
      )}
      <div>
        <Status color={state.color}>{state.label}</Status>
      </div>
    </OrderWrapper>
  );
};

export default Order;
