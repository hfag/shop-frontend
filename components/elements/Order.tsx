import React, { FunctionComponent } from "react";
import styled from "styled-components";

import { colors, borders, shadows } from "../../utilities/style";
import Price from "../elements/Price";
import StyledLink from "../elements/StyledLink";
import { Order as OrderType } from "../../schema";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useIntl } from "react-intl";
import Placeholder from "./Placeholder";

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
    case "AddingItems":
      return { color: colors.info, label: "Noch nicht versendet" };
    case "ArrangingPayment":
      return { color: colors.info, label: "Bezahlung ausstehend" };
    case "PaymentAuthorized":
      return { color: colors.info, label: "Zahlung freigegeben" };
    case "PaymentSettled":
      return { color: colors.success, label: "Zahlung abgeschlossen" };
    case "PartiallyFulfilled":
      return { color: colors.warning, label: "Teilweise abgeschlossen" };
    case "Cancelled":
      return { color: colors.danger, label: "Storniert" };
    case "Fulfilled":
      return { color: colors.success, label: "Abgeschlossen" };
    default:
      return { color: colors.danger, label: "Fehlgeschlagen" };
  }
};

/**
 * An order component
 */
const Order: FunctionComponent<{ order?: OrderType; compact?: boolean }> = ({
  order,
  compact,
}) => {
  const intl = useIntl();
  const date = new Date(order?.updatedAt);
  const state = getState(order?.state);
  //TODO: translate

  return (
    <OrderWrapper>
      <div>
        {order ? (
          <StyledLink
            href={`/${intl.locale}/${
              pathnamesByLanguage.account.languages[intl.locale]
            }/${
              pathnamesByLanguage.account.pathnames.orders.languages[
                intl.locale
              ]
            }/${order?.code}`}
            underlined
          >
            <h4>
              Bestellung #{order.code} vom {date.toLocaleDateString()}
            </h4>
          </StyledLink>
        ) : (
          <Placeholder height={1.5} mb={1} text />
        )}
      </div>
      {compact ? (
        order ? (
          <>
            {order.lines.length} verschiedene Produkte für{" "}
            <Price>{order.total}</Price>
          </>
        ) : (
          <Placeholder text />
        )
      ) : (
        <div>
          {order
            ? order.lines.map((line, index) => (
                <OrderItem key={index}>
                  <h5>
                    {line.productVariant.name} ({line.productVariant.sku})
                  </h5>
                  <OrderMeta>
                    {line.productVariant.options.map((o) => o.name).join(", ")}
                  </OrderMeta>
                </OrderItem>
              ))
            : new Array(2).fill(undefined).map((a, index) => (
                <OrderItem key={index}>
                  <Placeholder text height={3} />
                </OrderItem>
              ))}
          {order && <Price>{order.total}</Price>}
        </div>
      )}
      {order && (
        <div>
          <Status color={state.color}>{state.label}</Status>
        </div>
      )}
    </OrderWrapper>
  );
};

export default Order;
