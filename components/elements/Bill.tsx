import { defineMessages, useIntl } from "react-intl";
import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { colors } from "../../utilities/style";
import Price from "./Price";

const messages = defineMessages({
  taxes: {
    id: "Bill.taxes",
    defaultMessage: "zzgl. MwSt., zzgl. Versandkosten",
  },
});

const StyledBill = styled.ul`
  padding: 0;
  li {
    text-align: right;
    list-style: none;
  }
`;

const Quantity = styled.span`
  &:after {
    padding: 0 0.5rem;
    content: "x";
  }
`;
const DiscountPrice = styled.span``;

const Sum = styled.li`
  margin-top: 0.25rem;
  padding-top: 0.25rem;
  border-top: ${colors.secondary} 1px solid;
`;
const Taxes = styled.li``;

const Bill: FunctionComponent<{
  items: {
    quantity: number;
    price: number;
    discountPrice?: number;
    unit?: string | null;
  }[];
}> = React.memo(({ items }) => {
  const intl = useIntl();
  const taxes = intl.formatMessage(messages.taxes);

  const normalSum = items.reduce(
    (sum, { quantity, price }) => sum + quantity * price,
    0
  );
  const discountSum = items.reduce(
    (sum, { quantity, price, discountPrice }) =>
      sum + quantity * (discountPrice ? discountPrice : price),
    0
  );

  return (
    <StyledBill>
      {items.map(
        ({ quantity = 0, price, discountPrice, unit = false }, index) => {
          return quantity > 0 ? (
            <li key={index}>
              <Quantity>{quantity + (unit ? " " + unit : "")}</Quantity>
              {price ? (
                discountPrice ? (
                  <DiscountPrice>
                    <Price strike>{price}</Price> <Price>{discountPrice}</Price>
                  </DiscountPrice>
                ) : (
                  <Price>{price}</Price>
                )
              ) : (
                ""
              )}
            </li>
          ) : (
            <li key={index} />
          );
        }
      )}
      <Sum>
        {items.length > 0 ? (
          normalSum === discountSum ? (
            <Price>{normalSum}</Price>
          ) : (
            <DiscountPrice>
              <Price strike>{normalSum}</Price> <Price>{discountSum}</Price>
            </DiscountPrice>
          )
        ) : (
          "-"
        )}
      </Sum>
      <Taxes>{taxes}</Taxes>
    </StyledBill>
  );
});

export default Bill;
