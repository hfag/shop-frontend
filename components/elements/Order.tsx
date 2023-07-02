import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { Order as OrderType } from "../../schema";
import { borders } from "../../utilities/style";
import { defineMessages, useIntl } from "react-intl";
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

const OrderItem = styled.div`
  margin: 0.5rem 0 1rem 0;
`;
const OrderMeta = styled.div``;

/**
 * An order component
 */
const Order: FunctionComponent<{
  order?: OrderType | null;
  compact?: boolean;
}> = ({ order, compact }) => {
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
