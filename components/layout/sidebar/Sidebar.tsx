import {
  FaUser as AccountIcon,
  FaShoppingCart as CartIcon,
  FaCogs as GearsIcon,
  FaHome as HomeIcon,
  FaSignInAlt as SignInIcon,
} from "react-icons/fa";
import { useIntl } from "react-intl";
import React, { FunctionComponent, ReactNode, useContext } from "react";
import styled from "@emotion/styled";

import { AppContext } from "../../AppWrapper";
import { colors, media } from "../../../utilities/style";
import { pathnamesByLanguage } from "../../../utilities/urls";
import Card from "../Card";
import Link from "../../elements/StyledLink";
import MediaQuery from "../MediaQuery";
import RestrictedView from "../../elements/RestrictedView";
import page from "../../../i18n/page";

const BurgerContainer = styled(Card)<{ isOpen: boolean; hasChildren: boolean }>`
  height: 100%;
  z-index: 100;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;

  transition: all 0.3s ease-in;
  -webkit-overflow-scrolling: touch;

  padding: ${({ hasChildren }) => (hasChildren ? "1" : "0")}rem;

  ${media.maxLarge} {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;

    overflow-y: scroll;

    transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100%")});

    box-shadow: none !important;
    margin: 0;
    padding: 1rem;
  }
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

  user-select: none;
`;

const StyledSidebar = styled.div<{ hasChildren: boolean }>`
  height: 100%;
  width: ${({ hasChildren }) => (hasChildren ? "100%" : "auto")};
  padding-bottom: 2rem;
`;

const Sidebar: FunctionComponent<{ children: ReactNode }> = React.memo(
  ({ children }) => {
    const intl = useIntl();
    const { burgerMenuOpen, toggleBurgerMenu } = useContext(AppContext);
    const isAuthenticated = false;

    return (
      <StyledSidebar hasChildren={children ? true : false}>
        <BurgerBackground onClick={toggleBurgerMenu} isOpen={burgerMenuOpen} />
        <BurgerContainer
          isOpen={burgerMenuOpen}
          hasChildren={children ? true : false}
        >
          <MediaQuery lg down style={{ height: "auto" }}>
            <BurgerLogo src="/images/logo/name_slogan.svg" alt="Slogan" />
            <BurgerList>
              <BurgerItem seperator>
                <Link href={`/${intl.locale}/`} flex>
                  <HomeIcon />
                  {intl.formatMessage(page.home)}
                </Link>
              </BurgerItem>
              {/* <BurgerItem seperator>
                <Link
                  href={`/${intl.locale}/${
                    pathnamesByLanguage.search.languages[intl.locale]
                  }`}
                  flex
                >
                  <SearchIcon />
                  {intl.formatMessage(page.search)}
                </Link>
              </BurgerItem> */}
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
      </StyledSidebar>
    );
  }
);

export default Sidebar;
