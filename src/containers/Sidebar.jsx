import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import HomeIcon from "react-icons/lib/fa/home";
import SearchIcon from "react-icons/lib/fa/search";
import CartIcon from "react-icons/lib/fa/shopping-cart";
import AccountIcon from "react-icons/lib/fa/user";
import SignInIcon from "react-icons/lib/fa/sign-in";
import { withRouter } from "react-router";

import Link from "../components/Link";
import { media, colors } from "../utilities/style";
import NameSlogan from "../../img/logo/name_slogan.svg";
import { getIsAuthenticated, getBurgerMenuOpen } from "../reducers";
import { toggleBurgerMenu } from "../actions/burger-menu";
import MediaQuery from "../components/MediaQuery";
import Card from "../components/Card";

const BurgerContainer = styled(Card)`
  height: 100%;
  z-index: 100;

  transition: all 0.3s ease-in;

  ${media.maxLarge`
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 250px;
      
      overflow-y: scroll;

      transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100%")});

      box-shadow: none !important;
      margin: 0;
    }
`};
`;

const BurgerLogo = styled.img`
  width: 100%;
  height: auto;

  margin-bottom: 1rem;
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
    seperator ? `border-bottom: ${colors.primary} 1px solid;` : ""};

  svg {
    margin-right: 0.5rem;
  }
`;

const BurgerBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;

  transition: all 0.3s ease-in-out;

  opacity: ${({ isOpen }) => (isOpen ? 0.3 : 0)};

  z-index: ${({ isOpen }) => (isOpen ? 99 : -1)};
`;

/**
 * The sidebar
 * @returns {Component} The component
 */
class Sidebar extends React.PureComponent {
  render = () => {
    const {
      isOpen = false,
      isAuthenticated,
      toggleBurgerMenu,
      children
    } = this.props;

    return (
      <div style={{ height: "100%", paddingBottom: "2rem" }}>
        <BurgerBackground onClick={toggleBurgerMenu} isOpen={isOpen} />
        <BurgerContainer isOpen={isOpen}>
          <MediaQuery lg down style={{ height: "auto" }}>
            <BurgerLogo src={NameSlogan} alt="Slogan" />
            <BurgerList>
              <BurgerItem seperator>
                <Link to="/" flex>
                  <HomeIcon />Home
                </Link>
              </BurgerItem>
              <BurgerItem seperator>
                <Link to="/suche" flex>
                  <SearchIcon />Suche
                </Link>
              </BurgerItem>
              <BurgerItem seperator>
                <Link to="/warenkorb" flex>
                  <CartIcon />Warenkorb
                </Link>
              </BurgerItem>
              <BurgerItem seperator>
                {isAuthenticated ? (
                  <Link to="/konto" flex>
                    <span>
                      <AccountIcon />Mein Konto
                    </span>
                  </Link>
                ) : (
                  <Link to="/login" flex>
                    <span>
                      <SignInIcon />Login
                    </span>
                  </Link>
                )}
              </BurgerItem>
            </BurgerList>
          </MediaQuery>
          {children}
        </BurgerContainer>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  isOpen: getBurgerMenuOpen(state)
});

const mapDispatchToProps = dispatch => ({
  /**
   * Toggles the burger menu
   * @returns {void}
   */
  toggleBurgerMenu() {
    return dispatch(toggleBurgerMenu());
  }
});

const ConnectedSidebar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);

export default withRouter(ConnectedSidebar);
