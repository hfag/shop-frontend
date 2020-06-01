import React, { FunctionComponent, useContext, useEffect } from "react";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { defineMessages, useIntl } from "react-intl";

import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "../elements/StyledLink";
import Dropdown from "../elements/Dropdown";
import Circle from "../shapes/Circle";
import Button from "../elements/Button";
import Triangle from "../shapes/Triangle";
import { pathnamesByLanguage } from "../../utilities/urls";
import { colors } from "../../utilities/style";
import { AppContext } from "../../pages/_app";
import request from "../../utilities/request";
import { GET_ACTIVE_ORDER } from "../../gql/order";
import { Order } from "../../schema";
import Placeholder from "../elements/Placeholder";
import Thumbnail from "../Thumbnail";

const messages = defineMessages({
  emptyCart: {
    id: "NavCart.emptyCart",
    defaultMessage: "Es befinden sich bisher noch keine Produkte im Warenkorb.",
  },
  toCart: {
    id: "NavCart.toCart",
    defaultMessage: "Zum Warenkorb",
  },
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
}> = ({ dropdown, setDropdown }) => {
  const intl = useIntl();
  const router = useRouter();
  const { token } = useContext(AppContext);
  const {
    data,
  }: { data?: { activeOrder: Order | null }; error?: any } = useSWR(
    [GET_ACTIVE_ORDER, token],
    (query) => request(intl.locale, query)
  );

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
              {!data /* loading */ ? (
                <Placeholder
                  text
                  inline
                  height={1.25}
                  minWidth={0.75}
                  mb={-0.2}
                ></Placeholder>
              ) : data.activeOrder === null ? (
                0 /* no active order */
              ) : (
                data.activeOrder.lines.reduce(
                  (sum, line) => sum + line.quantity,
                  0
                )
              )}
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
              return Promise.resolve();
            }}
          >
            {intl.formatMessage(messages.toCart)}
          </Button>
          <hr />
          {!data ? (
            <Placeholder />
          ) : data.activeOrder && data.activeOrder.lines.length > 0 ? (
            data.activeOrder.lines.map((line, index) => (
              <ShoppingCartList key={index}>
                <div>
                  <Thumbnail asset={line.productVariant.featuredAsset} />
                </div>
                <div>
                  <strong>{line.quantity}x</strong>{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: line.productVariant.name,
                    }}
                  />
                </div>
              </ShoppingCartList>
            ))
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
};

export default NavCart;
