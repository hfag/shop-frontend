import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  FaHome as HomeIcon,
  FaSearch as SearchIcon,
  FaShoppingCart as CartIcon,
  FaUser as AccountIcon,
  FaSignInAlt as SignInIcon,
  FaCogs as GearsIcon
} from "react-icons/fa";
import { withRouter } from "react-router";
import { defineMessages, injectIntl } from "react-intl";

import Link from "../components/Link";
import { media, colors } from "../utilities/style";
import NameSlogan from "../../img/logo/name_slogan.svg";
import {
  getIsAuthenticated,
  getBurgerMenuOpen,
  getLanguage
} from "../reducers";
import { toggleBurgerMenu } from "../actions/burger-menu";
import MediaQuery from "../components/MediaQuery";
import Card from "../components/Card";
import RestrictedView from "./RestrictedView";
import { pathnamesByLanguage } from "../utilities/urls";
import page from "../i18n/page";

const BurgerContainer = styled(Card)`
  height: 100%;
  z-index: 100;

  transition: all 0.3s ease-in;
  -webkit-overflow-scrolling: touch;

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

const Sidebar = React.memo(
  injectIntl(
    ({
      language,
      isOpen = false,
      isAuthenticated,
      toggleBurgerMenu,
      children,
      intl
    }) => {
      return (
        <div style={{ height: "100%", paddingBottom: "2rem" }}>
          <BurgerBackground onClick={toggleBurgerMenu} isOpen={isOpen} />
          <BurgerContainer isOpen={isOpen}>
            <MediaQuery lg down style={{ height: "auto" }}>
              <BurgerLogo src={NameSlogan} alt="Slogan" />
              <BurgerList>
                <BurgerItem seperator>
                  <Link to={`/${language}/`} flex>
                    <HomeIcon />
                    {intl.formatMessage(page.home)}
                  </Link>
                </BurgerItem>
                <BurgerItem seperator>
                  <Link
                    to={`/${language}/${pathnamesByLanguage[language].search}`}
                    flex
                  >
                    <SearchIcon />
                    {intl.formatMessage(page.search)}
                  </Link>
                </BurgerItem>
                <BurgerItem seperator>
                  <Link
                    to={`/${language}/${pathnamesByLanguage[language].cart}`}
                    flex
                  >
                    <CartIcon />
                    {intl.formatMessage(page.cart)}
                  </Link>
                </BurgerItem>
                <BurgerItem seperator>
                  {isAuthenticated ? (
                    <Link
                      to={`/${language}/${
                        pathnamesByLanguage[language].account
                      }`}
                      flex
                    >
                      <span>
                        <AccountIcon />
                        {intl.formatMessage(page.myAccount)}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to={`/${language}/${pathnamesByLanguage[language].login}`}
                      flex
                    >
                      <span>
                        <SignInIcon />
                        {intl.formatMessage(page.login)}
                      </span>
                    </Link>
                  )}
                  <RestrictedView>
                    <Link href="https://api.feuerschutz.ch/wp-admin" flex>
                      <span>
                        <GearsIcon />
                        {intl.formatMessage(page.shopAdmin)}
                      </span>
                    </Link>
                    <Link
                      href="https://feuerschutz.ch/wp-login.php?action=login"
                      flex
                    >
                      <span>
                        <GearsIcon />
                        {intl.formatMessage(page.networkAdmin)}
                      </span>
                    </Link>
                  </RestrictedView>
                </BurgerItem>
              </BurgerList>
            </MediaQuery>
            {children}
          </BurgerContainer>
        </div>
      );
    }
  )
);

const mapStateToProps = state => ({
  language: getLanguage(state),
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
