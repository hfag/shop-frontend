import React from "react";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";

import Link from "../Link";
import Dropdown from "../Dropdown";
import Circle from "../Circle";
import Button from "../Button";
import Triangle from "../Triangle";

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

const NavCart = React.memo(
  ({
    shoppingCartFetching,
    shoppingCartItems,
    shoppingCartTotal,
    dropdown,
    setDropdown
  }) => {
    return (
      <React.Fragment>
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
                {shoppingCartFetching
                  ? ""
                  : shoppingCartItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
              </small>
            </Circle>
          </Counter>
          <Triangle color="#fff" size="0.5rem" />
        </Link>
        {dropdown === "cart" && (
          <Dropdown>
            {shoppingCartItems.length > 0 ? (
              shoppingCartItems.map((item, index) => (
                <ShoppingCartList key={index}>
                  <div>
                    <Thumbnail id={item.thumbnailId} size="thumbnail" />
                  </div>
                  <div>
                    <strong>{item.quantity}x</strong> {item.title}
                  </div>
                </ShoppingCartList>
              ))
            ) : (
              <div>
                Es befinden sich bisher noch keine Produkte im Warenkorb.
                <br />
                <br />
              </div>
            )}
            <Button
              fullWidth
              onClick={() =>
                new Promise((resolve, reject) => {
                  redirect("/warenkorb");
                  setDropdown(false);
                })
              }
            >
              Zum Warenkorb
            </Button>
          </Dropdown>
        )}
      </React.Fragment>
    );
  }
);

export default NavCart;
