import React, { FunctionComponent, ReactNode, useCallback } from "react";
import styled from "styled-components";
import {
  FaHome as HomeIcon,
  FaSearch as SearchIcon,
  FaShoppingCart as CartIcon,
  FaUser as AccountIcon,
  FaSignInAlt as SignInIcon,
  FaCogs as GearsIcon,
} from "react-icons/fa";
import { useIntl } from "react-intl";

import Link from "./StyledLink";
import { media, colors } from "../utilities/style";
import NameSlogan from "../public/images/logo/name_slogan.svg";
import MediaQuery from "./layout/MediaQuery";
import Card from "./Card";
import RestrictedView from "./RestrictedView";
import { pathnamesByLanguage } from "../utilities/urls";
import page from "../i18n/page";

interface BurgerContainer {
  isOpen?: boolean;
}

const BurgerContainer = styled(Card)<BurgerContainer>`
  height: 100%;
  z-index: 100;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;

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

interface BurgerItemProps {
  seperator?: boolean;
}

const BurgerItem = styled.li<BurgerItemProps>`
  margin: 0 0 0.5rem 0;
  padding: 0 0 0.5rem 0;
  ${({ seperator }) =>
    seperator ? `border-bottom: ${colors.primary} 1px solid;` : ""};

  svg {
    margin-right: 0.5rem;
  }
`;

interface BurgerBackgroundProps {
  isOpen?: boolean;
}

const BurgerBackground = styled.div<BurgerBackgroundProps>`
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

const Sidebar: FunctionComponent<{ children: ReactNode }> = React.memo(
  ({ children }) => {
    const intl = useIntl();
    const toggleBurgerMenu = useCallback(() => {}, []);
    const isOpen = false;
    const isAuthenticated = false;

    return (
      <div style={{ height: "100%", paddingBottom: "2rem" }}>
        <BurgerBackground onClick={toggleBurgerMenu} isOpen={isOpen} />
        <BurgerContainer isOpen={isOpen}>
          <MediaQuery lg down style={{ height: "auto" }}>
            <BurgerLogo src={NameSlogan} alt="Slogan" />
            <BurgerList>
              <BurgerItem seperator>
                <Link href={`/${intl.locale}/`} flex>
                  <HomeIcon />
                  {intl.formatMessage(page.home)}
                </Link>
              </BurgerItem>
              <BurgerItem seperator>
                <Link
                  href={`/${intl.locale}/${
                    pathnamesByLanguage.search.languages[intl.locale]
                  }`}
                  flex
                >
                  <SearchIcon />
                  {intl.formatMessage(page.search)}
                </Link>
              </BurgerItem>
              <BurgerItem seperator>
                <Link
                  href={`/${intl.locale}/${
                    pathnamesByLanguage.cart.languages[intl.locale]
                  }`}
                  flex
                >
                  <CartIcon />
                  {intl.formatMessage(page.cart)}
                </Link>
              </BurgerItem>
              <BurgerItem seperator>
                {isAuthenticated ? (
                  <Link
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.account.languages[intl.locale]
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
                    href={`/${intl.locale}/${
                      pathnamesByLanguage.login.languages[intl.locale]
                    }`}
                    flex
                  >
                    <span>
                      <SignInIcon />
                      {intl.formatMessage(page.login)}
                    </span>
                  </Link>
                )}
                <RestrictedView>
                  <Link
                    external
                    href="https://api.feuerschutz.ch/wp-admin"
                    flex
                  >
                    <span>
                      <GearsIcon />
                      {intl.formatMessage(page.shopAdmin)}
                    </span>
                  </Link>
                  <Link
                    external
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
);

export default Sidebar;
