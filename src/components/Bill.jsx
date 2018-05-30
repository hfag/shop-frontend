import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { colors } from "../utilities/style";
import Price from "./Price";

const StyledBill = styled.ul`
  padding: 0;
  li {
    text-align: right;
    list-style: none;
  }
`;

const Count = styled.span`
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

/**
 * Renders a bill like component
 * @returns {Component} The component
 */
class Bill extends React.PureComponent {
  render = () => {
    const { items } = this.props;
    const currency = "CHF";
    const taxes = "zzgl. MwSt., zzgl. Versandkosten";

    const normalSum = items.reduce(
      (sum, { count, price }) => sum + count * price,
      0
    );
    const discountSum = items.reduce(
      (sum, { count, price, discountPrice }) =>
        sum + count * (discountPrice ? discountPrice : price),
      0
    );

    return (
      <StyledBill>
        {items.map(({ count = 0, price, discountPrice }, index) => {
          return count > 0 ? (
            <li key={index}>
              <Count>{count}</Count>
              {currency}{" "}
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
        })}
        <Sum>
          {currency}{" "}
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
  };
}

Bill.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Bill;
