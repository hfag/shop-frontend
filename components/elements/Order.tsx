import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { IntlShape, defineMessages, useIntl } from "react-intl";
import { Order as OrderType } from "../../schema";
import { borders, colors } from "../../utilities/style";
import { pathnamesByLanguage } from "../../utilities/urls";
import Placeholder from "./Placeholder";
import Price from "../elements/Price";
import StyledLink from "../elements/StyledLink";

const messages = defineMessages({
  order: {
    id: "Order.order",
    defaultMessage: "Bestellung",
  },
  differentProducts: {
    id: "Order.differentProducts",
    defaultMessage: "verschiedene Produkte für",
  },
  addingItems: {
    id: "Order.addingItem",
    defaultMessage: "Noch nicht versendet",
  },
  arrangingPayment: {
    id: "Order.arrangingPayment",
    defaultMessage: "Bezahlung ausstehend",
  },
  paymentAuthorized: {
    id: "Order.paymentAuthorized",
    defaultMessage: "Zahlung freigegeben",
  },
  paymentSettled: {
    id: "Order.paymentSettled",
    defaultMessage: "Zahlung abgeschlossen",
  },
  partiallyFulfilled: {
    id: "Order.partiallyFulfilled",
    defaultMessage: "Teilweise abgeschlossen",
  },
  cancelled: {
    id: "Order.cancelled",
    defaultMessage: "Storniert",
  },
  fulfilled: {
    id: "Order.fulfilled",
    defaultMessage: "Abgeschlossen",
  },
});

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
 */
const getState = (status: string | undefined, intl: IntlShape) => {
  switch (status) {
    case "AddingItems":
      return {
        color: colors.info,
        label: intl.formatMessage(messages.addingItems),
      };
    case "ArrangingPayment":
      return {
        color: colors.info,
        label: intl.formatMessage(messages.arrangingPayment),
      };
    case "PaymentAuthorized":
      return {
        color: colors.info,
        label: intl.formatMessage(messages.paymentAuthorized),
      };
    case "PaymentSettled":
      return {
        color: colors.success,
        label: intl.formatMessage(messages.paymentSettled),
      };
    case "PartiallyFulfilled":
      return {
        color: colors.warning,
        label: intl.formatMessage(messages.partiallyFulfilled),
      };
    case "Cancelled":
      return {
        color: colors.danger,
        label: intl.formatMessage(messages.cancelled),
      };
    case "Fulfilled":
      return {
        color: colors.success,
        label: intl.formatMessage(messages.fulfilled),
      };
    default:
      return { color: colors.danger, label: status };
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
              {intl.formatMessage(messages.order)} #{order.code}{" "}
              {date.toLocaleDateString()}
            </h4>
          </StyledLink>
        ) : (
          <Placeholder height={1.5} mb={1} text />
        )}
      </div>
      {compact ? (
        order ? (
          <>
            {order.lines.length}{" "}
            {intl.formatMessage(messages.differentProducts)}{" "}
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
    </OrderWrapper>
  );
};

export default Order;
