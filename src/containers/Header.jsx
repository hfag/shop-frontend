import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import styled from "styled-components";
import MenuIcon from "react-icons/lib/md/menu";
import CartIcon from "react-icons/lib/fa/shopping-cart";
import LoadingBar from "react-redux-loading-bar";
import { Flex, Box } from "grid-styled";
import { Helmet } from "react-helmet";

import { fetchShoppingCartIfNeeded } from "../actions/shopping-cart";
import {
  isFetchingShoppingCart,
  getShoppingCartItems,
  getShoppingCartTotal,
  getIsAuthenticated,
  getAccount
} from "../reducers";
import { borders, shadows } from "../utilities/style";
import Container from "../components/Container";
import Flexbar from "../components/Flexbar";
import Button from "../components/Button";
import Price from "../components/Price";
import Triangle from "../components/Triangle";
import Push from "../components/Push";
import Circle from "../components/Circle";
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
import RestrictedView from "./RestrictedView";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;
const PUBLIC_PATH = process.env.PUBLIC_PATH;

const Counter = styled.div`
  margin-left: 0.5rem;
  font-size: 1.25rem;
`;

const SearchWrapper = styled.div`
  width: 100%;
  margin-right: 1rem;
`;

const HeaderWrapper = styled.div`
  margin-top: 5rem;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: -4.5rem;
  right: -5rem;

  max-height: 15rem;
  overflow-y: auto;

  margin-top: 1rem;
  padding: 0.5rem;

  background-color: #fff;
  color: #000;
  border-radius: ${borders.radius};
  box-shadow: ${shadows.y};
`;

const UserDropdown = styled(Dropdown)`
  left: 0;
  right: 0;
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

const FullHeightBox = styled(Box)`
  height: 100%;
  position: relative;
`;

const LogoLeft = styled.div`
  padding: 0 0.5rem 0 1rem;
  height: 100%;
`;

const Login = styled.span`
  font-weight: normal;
  white-space: nowrap;
`;
/**
 * The page header
 * @returns {Component} The component
 */
class Header extends React.PureComponent {
  constructor() {
    super();
    this.state = { dropdown: false };
  }
  componentDidMount = () => {
    const { fetchShoppingCartIfNeeded, fetchSalesIfNeeded } = this.props;
    fetchShoppingCartIfNeeded();
    fetchSalesIfNeeded();
  };
  render = () => {
    const {
      account,
      isAuthenticated,
      toggleBurgerMenu,
      shoppingCartFetching,
      shoppingCartItems,
      shoppingCartTotal,
      redirect
    } = this.props;

    return (
      <HeaderWrapper>
        <Helmet>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="author" content="Nico Hauser" />
          <meta name="format-detection" content="telephone=no" />

          <title>Shop der Hauser Feuerschutz AG</title>
          <meta
            name="description"
            content="Bei der Hauser Feuerschutz AG finden Sie alle Produkte im Bereich Feuerschutz sowie ein kompetenter Kundensupport der Ihnen gerne Ihre Fragen beantwortet."
          />
          <link rel="canonical" href={ABSOLUTE_URL} />
        </Helmet>
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
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                opens: "09:00",
                closes: "12:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                opens: "13:30",
                closes: "17:00"
              }
            ]
          }}
        </JsonLd>
        <LoadingBar className="redux-loading-bar" />
        <header>
          <Navbar>
            <Flex>
              <FullHeightBox width={[0, 0, 0, 1 / 6]}>
                <MediaQuery lg up>
                  <LogoLeft>
                    <NavItem>
                      <Link to="/" title="Homepage">
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
                        <Link to="/" title="Homepage">
                          <img src={NameSloganNegative} alt="Slogan" />
                        </Link>
                      </NavItem>
                    </MediaQuery>

                    <MediaQuery lg down>
                      <Flexbar>
                        <NavItem>
                          <Link onClick={toggleBurgerMenu} negative>
                            <MenuIcon size="40" />
                          </Link>
                        </NavItem>

                        <NavItem>
                          <Link to="/" title="Homepage">
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
                            <Link
                              onClick={() => {
                                this.setState({
                                  dropdown:
                                    this.state.dropdown === "cart"
                                      ? false
                                      : "cart"
                                });
                              }}
                              negative
                              flex
                            >
                              <CartIcon size="35" />
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
                            {this.state.dropdown === "cart" && (
                              <Dropdown>
                                {shoppingCartItems.length > 0 ? (
                                  shoppingCartItems.map((item, index) => (
                                    <ShoppingCartList key={index}>
                                      <div>
                                        <Thumbnail
                                          id={item.thumbnailId}
                                          size="thumbnail"
                                        />
                                      </div>
                                      <div>
                                        <strong>{item.quantity}x</strong>{" "}
                                        {item.title}
                                      </div>
                                    </ShoppingCartList>
                                  ))
                                ) : (
                                  <div>
                                    Es befinden sich bisher noch keine Produkte
                                    im Warenkorb.
                                    <br />
                                    <br />
                                  </div>
                                )}
                                <Button
                                  fullWidth
                                  onClick={() =>
                                    new Promise((resolve, reject) => {
                                      redirect("/warenkorb");
                                      this.setState(
                                        { showShoppingCartDropdown: false },
                                        resolve
                                      );
                                    })
                                  }
                                >
                                  Zum Warenkorb
                                </Button>
                              </Dropdown>
                            )}
                          </NavItem>
                          <NavItem>
                            {isAuthenticated ? (
                              <div>
                                <Link
                                  onClick={() => {
                                    this.setState({
                                      dropdown:
                                        this.state.dropdown === "user"
                                          ? false
                                          : "user"
                                    });
                                  }}
                                  negative
                                  flex
                                >
                                  <Login>
                                    {account.firstName.length > 0 ||
                                    account.lastName.length > 0
                                      ? `${account.firstName} ${
                                          account.lastName
                                        }`
                                      : account.email}
                                  </Login>
                                  <Triangle color="#fff" size="0.5rem" />
                                </Link>
                                {this.state.dropdown === "user" && (
                                  <UserDropdown>
                                    <div>
                                      <Link to="/konto" active={false}>
                                        Zum Konto
                                      </Link>
                                    </div>
                                    <RestrictedView>
                                      <div>
                                        <Link href="https://api.feuerschutz.ch/wp-admin">
                                          Shop-Admin
                                        </Link>
                                      </div>
                                      <div>
                                        <Link href="https://feuerschutz.ch/wp-login.php?action=login">
                                          Netzwerk-Admin
                                        </Link>
                                      </div>
                                    </RestrictedView>
                                    <div>
                                      <Link to="/logout" active={false}>
                                        Abmelden
                                      </Link>
                                    </div>
                                  </UserDropdown>
                                )}
                              </div>
                            ) : (
                              <Link to="/login" negative flex>
                                <Login>Login</Login>
                              </Link>
                            )}
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
  };
}

const mapStateToProps = state => ({
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
   * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchShoppingCartIfNeeded(visualize = false) {
    return dispatch(fetchShoppingCartIfNeeded());
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
   * @param {boolean} visualize Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  fetchSalesIfNeeded(visualize = false) {
    return dispatch(fetchSalesIfNeeded(visualize));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
