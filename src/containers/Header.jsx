import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import styled from "styled-components";
import { MdMenu } from "react-icons/md";
import LoadingBar from "react-redux-loading-bar";
import { Flex, Box } from "grid-styled";
import { Helmet } from "react-helmet";

import { fetchShoppingCartIfNeeded } from "../actions/shopping-cart";
import {
  isFetchingShoppingCart,
  getShoppingCartItems,
  getShoppingCartTotal,
  getIsAuthenticated,
  getAccount,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import Container from "../components/Container";
import Flexbar from "../components/Flexbar";
import Triangle from "../components/Triangle";
import Push from "../components/Push";
import Dropdown from "../components/Dropdown";
import Link from "../components/Link";
import MediaQuery from "../components/MediaQuery";
import NavItem from "../components/NavItem";
import Navbar from "../components/Navbar";
import Searchbar from "../containers/Searchbar";
import LogoNegative from "../../img/logo/logo_negative.svg";
import NameSloganNegative from "../../img/logo/name_slogan_negative.svg";
import Thumbnail from "./Thumbnail";
import { toggleBurgerMenu } from "../actions/burger-menu";
import JsonLd from "../components/JsonLd";
import { fetchSalesIfNeeded } from "../actions/sales";
import LanguageSwitcher from "../components/header/LanguageSwitcher";
import NavCart from "../components/header/NavCart";
import NavUser from "../components/header/NavUser";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;
const PUBLIC_PATH = process.env.PUBLIC_PATH;

const SearchWrapper = styled.div`
  width: 100%;
  margin-right: 1rem;
`;

const HeaderWrapper = styled.div`
  margin-top: 5rem;
`;

const FullHeightBox = styled(Box)`
  height: 100%;
  position: relative;
`;

const LogoLeft = styled.div`
  padding: 0 0.5rem 0 1rem;
  height: 100%;
`;

const Head = React.memo(() => {
  return (
    <Helmet
      title="Shop der Hauser Feuerschutz AG"
      meta={[
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "author", content: "Nico Hauser" },
        { name: "format-detection", content: "telephone=no" },
        {
          name: "description",
          content:
            "Bei der Hauser Feuerschutz AG finden Sie alle Produkte im Bereich Feuerschutz sowie ein kompetenter Kundensupport der Ihnen gerne Ihre Fragen beantwortet."
        }
      ]}
      link={[{ rel: "canonical", href: ABSOLUTE_URL }]}
    />
  );
});

const RichSnippet = React.memo(() => {
  return (
    <JsonLd>
      {{
        "@context": "http://schema.org",
        "@type": "LocalBusiness ",
        image: [
          ABSOLUTE_URL + PUBLIC_PATH + "img/logo/logo-1x1.png",
          ABSOLUTE_URL + PUBLIC_PATH + "img/logo/logo-4x3.png",
          ABSOLUTE_URL + PUBLIC_PATH + "img/logo/logo-16x9.png"
        ],
        logo: ABSOLUTE_URL + PUBLIC_PATH + "img/logo/logo.png",
        "@id": ABSOLUTE_URL + "/#organization",
        branchCode: "ch.feuerschutz.1",
        name: "Hauser Feuerschutz AG",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Sonnmattweg 6",
          addressLocality: "Aarau",
          addressRegion: "AG",
          postalCode: "5000",
          addressCountry: "CH"
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 47.3971281,
          longitude: 8.0434878
        },
        url: ABSOLUTE_URL,
        telephone: "+41628340540",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+41628340540",
            contactType: "customer service",
            availableLanguage: ["German", "French", "Italian", "English"],
            contactOption: "TollFree",
            areaServed: ["CH"]
          }
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "12:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "13:30",
            closes: "17:00"
          }
        ]
      }}
    </JsonLd>
  );
});

const Header = React.memo(
  ({
    account,
    isAuthenticated,
    toggleBurgerMenu,
    shoppingCartFetching,
    shoppingCartItems,
    shoppingCartTotal,
    redirect,
    fetchShoppingCartIfNeeded,
    fetchSalesIfNeeded,
    language
  }) => {
    const [dropdown, setDropdown] = useState(false);

    useEffect(() => {
      fetchShoppingCartIfNeeded();
      fetchSalesIfNeeded();
    }, []); //run on initial render

    return (
      <HeaderWrapper>
        <Head />
        <RichSnippet />
        <LoadingBar className="redux-loading-bar" />
        <header>
          <Navbar>
            <Flex>
              <FullHeightBox width={[0, 0, 0, 1 / 6]}>
                <MediaQuery lg up>
                  <LogoLeft>
                    <NavItem>
                      <Link to={`/${language}`} title="Homepage">
                        <img src={LogoNegative} alt="Logo" />
                      </Link>
                    </NavItem>
                  </LogoLeft>
                </MediaQuery>
              </FullHeightBox>
              <FullHeightBox width={[1, 1, 1, 5 / 6]} pl={2}>
                <Container>
                  <Flexbar>
                    <MediaQuery lg up>
                      <NavItem>
                        <Link to={`/${language}`} title="Homepage">
                          <img src={NameSloganNegative} alt="Slogan" />
                        </Link>
                      </NavItem>
                    </MediaQuery>
                    <MediaQuery lg down>
                      <Flexbar>
                        <NavItem>
                          <Link onClick={toggleBurgerMenu} negative>
                            <MdMenu size="40" />
                          </Link>
                        </NavItem>
                        <NavItem>
                          <Link to={`/${language}`} title="Homepage">
                            <img src={LogoNegative} alt="Logo" />
                          </Link>
                        </NavItem>
                      </Flexbar>
                    </MediaQuery>
                    <SearchWrapper>
                      <MediaQuery md up>
                        <Searchbar />
                      </MediaQuery>
                    </SearchWrapper>
                    <Push left>
                      <MediaQuery md up>
                        <Flexbar>
                          <NavItem seperator>
                            <LanguageSwitcher
                              dropdown={dropdown}
                              setDropdown={setDropdown}
                            />
                          </NavItem>
                          <NavItem seperator>
                            <NavCart
                              language={language}
                              shoppingCartFetching={shoppingCartFetching}
                              shoppingCartItems={shoppingCartItems}
                              shoppingCartTotal={shoppingCartTotal}
                              redirect={redirect}
                              dropdown={dropdown}
                              setDropdown={setDropdown}
                            />
                          </NavItem>
                          <NavItem>
                            <NavUser
                              language={language}
                              isAuthenticated={isAuthenticated}
                              account={account}
                              dropdown={dropdown}
                              setDropdown={setDropdown}
                            />
                          </NavItem>
                        </Flexbar>
                      </MediaQuery>
                    </Push>
                  </Flexbar>
                </Container>
              </FullHeightBox>
            </Flex>
          </Navbar>
        </header>
      </HeaderWrapper>
    );
  }
);

const mapStateToProps = state => ({
  languageFetchString: getLanguageFetchString(state),
  language: getLanguage(state),
  shoppingCartFetching: isFetchingShoppingCart(state),
  shoppingCartItems: getShoppingCartItems(state),
  shoppingCartTotal: getShoppingCartTotal(state),
  isAuthenticated: getIsAuthenticated(state),
  account: getAccount(state)
});

const mapDispatchToProps = dispatch => ({
  /**
   * Sets the burger menu open state
   * @returns {void}
   */
  toggleBurgerMenu() {
    return dispatch(toggleBurgerMenu());
  },
  /**
   * Fetches the shopping cart
   * @param {string} language The language string
   * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchShoppingCartIfNeeded(language, visualize = false) {
    return dispatch(fetchShoppingCartIfNeeded(language, visualize));
  },
  /**
   * Redirects the client to a url
   * @param {string} url The page url to redirect to
   * @returns {void}
   */
  redirect(url) {
    return dispatch(push(url));
  },
  /**
   * Fetches all sales if needed
   * @param {string} language The language string
   * @param {boolean} visualize Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  fetchSalesIfNeeded(language, visualize = false) {
    return dispatch(fetchSalesIfNeeded(language, visualize));
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches the shopping cart
   * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchShoppingCartIfNeeded(visualize = false) {
    return mapDispatchToProps.fetchShoppingCartIfNeeded(
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Fetches all sales if needed
   * @param {boolean} visualize Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  fetchSalesIfNeeded(visualize = false) {
    return mapDispatchToProps.fetchSalesIfNeeded(
      mapStateToProps.languageFetchString,
      visualize
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Header);
