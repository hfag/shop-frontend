import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { elastic as Menu } from "react-burger-menu";
import { decorator as reduxBurgerMenu } from "redux-burger-menu";
import HomeIcon from "react-icons/lib/fa/home";
import SearchIcon from "react-icons/lib/fa/search";
import CartIcon from "react-icons/lib/fa/shopping-cart";
import CheckoutIcon from "react-icons/lib/fa/money";
import AccountIcon from "react-icons/lib/fa/user";
import SignInIcon from "react-icons/lib/fa/sign-in";
import { withRouter } from "react-router";

import Link from "../components/Link";
import { colors } from "../utilities/style";
import NameSloganNegative from "../../img/logo/name_slogan_negative.svg";
import { getIsAuthenticated } from "../reducers";

const BurgerLogo = styled.img`
  width: 100%;
  height: auto;

  margin-bottom: 2rem;
`;
const BurgerList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;
const BurgerItem = styled.li`
  margin: 0 0 0.5rem 0;
  padding: 0 0 0.5rem 0;
  ${({ seperator }) =>
    seperator ? `border-bottom: ${colors.primaryContrast} 1px solid;` : ""};

  svg {
    margin-right: 0.5rem;
  }
`;

const ReduxBurgerMenu = reduxBurgerMenu(Menu);

/**
 * The burger mobile menu
 * @returns {Component} The component
 */
class BurgerMenu extends React.PureComponent {
  render = () => {
    const { isAuthenticated } = this.props;

    return (
      <ReduxBurgerMenu right>
        <BurgerLogo src={NameSloganNegative} />
        <BurgerList>
          <BurgerItem seperator>
            <Link to="https://feuerschutz.ch" negative flex>
              <HomeIcon />Zu unserer Homepage
            </Link>
          </BurgerItem>
          <BurgerItem seperator>
            <Link to="/suche" negative flex>
              <SearchIcon />Suche
            </Link>
          </BurgerItem>
          <BurgerItem seperator>
            <Link to="/warenkorb" negative flex>
              <CartIcon />Warenkorb
            </Link>
          </BurgerItem>
          <BurgerItem>
            {isAuthenticated ? (
              <Link to="/konto" negative flex>
                <span>
                  <AccountIcon />Mein Konto
                </span>
              </Link>
            ) : (
              <Link to="/login" negative flex>
                <span>
                  <SignInIcon />Login
                </span>
              </Link>
            )}
          </BurgerItem>
        </BurgerList>
      </ReduxBurgerMenu>
    );
  };
}

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state)
});

const ConnectedBurgerMenu = connect(mapStateToProps)(BurgerMenu);

export default withRouter(ConnectedBurgerMenu);
