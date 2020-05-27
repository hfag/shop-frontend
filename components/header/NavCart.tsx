import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { defineMessages, useIntl } from "react-intl";

import Link from "../StyledLink";
import Dropdown from "../Dropdown";
import Circle from "../shapes/Circle";
import Button from "../Button";
import Triangle from "../Triangle";
import { pathnamesByLanguage } from "../../utilities/urls";
import { colors } from "../../utilities/style";
import { useRouter } from "next/router";

const messages = defineMessages({
  emptyCart: {
    id: "NavCart.emptyCart",
    defaultMessage: "Es befinden sich bisher noch keine Produkte im Warenkorb."
  },
  toCart: {
    id: "NavCart.toCart",
    defaultMessage: "Zum Warenkorb"
  }
});

const Counter = styled.div`
  margin-left: 0.5rem;
  font-size: 1.25rem;
`;

const ShoppingCartList = styled.div`
  width: 100%;
  margin: 0 0 1rem 0;
  padding: 0;
  font-size: 0.8rem;

  display: flex;
  align-items: center;

  & > div:first-child {
    flex: 0 0 10%;
    margin-right: 0.5rem;
  }

  img {
    width: 100%;
  }
`;

const NavCart: FunctionComponent<{
  dropdown: string | boolean;
  setDropdown: (dropdown: string | boolean) => void;
}> = React.memo(({ dropdown, setDropdown }) => {
  const intl = useIntl();
  const router = useRouter();

  return (
    <>
      <Link
        onClick={() => setDropdown(dropdown === "cart" ? false : "cart")}
        negative
        flex
      >
        <FaShoppingCart size="35" />
        <Counter>
          <Circle
            negative
            filled
            width="1.75rem"
            height="1.75rem"
            padding="0"
            centerChildren
          >
            <small>
              {/*shoppingCartFetching
                ? ""
                : shoppingCartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                )*/}
            </small>
          </Circle>
        </Counter>
        <Triangle color={colors.primaryContrast} size="0.5rem" />
      </Link>
      {dropdown === "cart" && (
        <Dropdown>
          <Button
            fullWidth
            onClick={() => {
              router.push(
                `/${intl.locale}/${
                  pathnamesByLanguage.cart.languages[intl.locale]
                }`
              );
              setDropdown(false);
            }}
          >
            {intl.formatMessage(messages.toCart)}
          </Button>
          <hr />
          {false ? (
            <>

            </> /*shoppingCartItems.length > 0 ? (
            shoppingCartItems.map((item, index) => (
              <ShoppingCartList key={index}>
                <div>
                  <Thumbnail id={item.thumbnailId} size="thumbnail" />
                </div>
                <div>
                  <strong>{item.quantity}x</strong>{" "}
                  <span dangerouslySetInnerHTML={{ __html: item.title }} />
                </div>
              </ShoppingCartList>
            ))*/
          ) : (
            <div>
              {intl.formatMessage(messages.emptyCart)}
              <br />
              <br />
            </div>
          )}
        </Dropdown>
      )}
    </>
  );
});

export default NavCart;
