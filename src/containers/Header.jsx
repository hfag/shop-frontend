import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import styled from "styled-components";
import { action as toggleBurgerMenuAction } from "redux-burger-menu";
import MenuIcon from "react-icons/lib/md/menu";
import SearchIcon from "react-icons/lib/fa/search";
import CartIcon from "react-icons/lib/fa/shopping-cart";
import CheckoutIcon from "react-icons/lib/fa/money";
import AccountIcon from "react-icons/lib/fa/user";
import SignInIcon from "react-icons/lib/fa/sign-in";
import LoadingBar from "react-redux-loading-bar";
import { Flex, Box } from "grid-styled";

import { fetchShoppingCart } from "../actions/shopping-cart";
import {
  getShoppingCartFetching,
  getShoppingCartItems,
  getShoppingCartTotal,
  getBurgerMenuOpen,
  getIsAuthenticated
} from "../reducers";
import { colors, borders, shadows } from "../utilities/style";
import Container from "../components/Container";
import Flexbar from "../components/Flexbar";
import Button from "../components/Button";
import Price from "../components/Price";
import Triangle from "../components/Triangle";
import Push from "../components/Push";
import Circle from "../components/Circle";
import Link from "../components/Link";
import MediaQuery from "../components/MediaQuery";
import BurgerMenu from "../components/BurgerMenu";
import NavItem from "../components/NavItem";
import Navbar from "../components/Navbar";
import Searchbar from "../containers/Searchbar";
import LogoNegative from "../../img/logo/logo_negative.svg";
import NameSloganNegative from "../../img/logo/name_slogan_negative.svg";
import Thumbnail from "./Thumbnail";

const Counter = styled.div`
  margin-left: 0.5rem;
  font-size: 1.25rem;
`;

const SearchWrapper = styled.div`
  width: 100%;
  margin-right: 1rem;
`;

const SloganWrapper = styled.div`
  height: 100%;
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

/**
 * The page header
 * @returns {Component} The component
 */
class Header extends React.PureComponent {
  constructor() {
    super();
    this.state = { showShoppingCartDropdown: false };
  }
  componentDidMount = () => {
    const { fetchShoppingCart } = this.props;
    fetchShoppingCart();
  };
  render = () => {
    const {
      isAuthenticated,
      toggleBurgerMenu,
      shoppingCartFetching,
      shoppingCartItems,
      shoppingCartTotal,
      redirect
    } = this.props;

    return (
      <HeaderWrapper>
        <LoadingBar className="redux-loading-bar" />
        <BurgerMenu />
        <header>
          <Navbar>
            <Container>
              <Flexbar>
                <Link to="/">
                  <Flexbar>
                    <NavItem>
                      <img src={LogoNegative} />
                    </NavItem>
                    <MediaQuery lg up>
                      <SloganWrapper>
                        <NavItem>
                          <img src={NameSloganNegative} />
                        </NavItem>
                      </SloganWrapper>
                    </MediaQuery>
                  </Flexbar>
                </Link>
                <SearchWrapper>
                  <MediaQuery md up>
                    <Searchbar />
                  </MediaQuery>
                </SearchWrapper>
                <Push left>
                  <MediaQuery md down>
                    <NavItem>
                      <Link onClick={toggleBurgerMenu} negative>
                        <MenuIcon size="40" />
                      </Link>
                    </NavItem>
                  </MediaQuery>
                  <MediaQuery md up>
                    <Flexbar>
                      <NavItem seperator>
                        <Link
                          onClick={() => {
                            this.setState({
                              showShoppingCartDropdown: !this.state
                                .showShoppingCartDropdown
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
                        {this.state.showShoppingCartDropdown && (
                          <Dropdown>
                            {shoppingCartItems.length > 0 ? (
                              shoppingCartItems.map((item, index) => (
                                <ShoppingCartList key={index}>
                                  <div>
                                    <Thumbnail
                                      id={item.thumbnailId}
                                      size="search-thumbnail"
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
                                Es befinden sich bisher noch keine Produkte im
                                Warenkorb.
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
                          <Link to="/konto" negative flex>
                            <Circle negative padding="0.35rem">
                              <AccountIcon size="30" />
                            </Circle>
                          </Link>
                        ) : (
                          <Link to="/login" negative flex>
                            <Circle negative padding="0.35rem">
                              <SignInIcon size="30" />
                            </Circle>
                          </Link>
                        )}
                      </NavItem>
                    </Flexbar>
                  </MediaQuery>
                </Push>
              </Flexbar>
            </Container>
          </Navbar>
        </header>
      </HeaderWrapper>
    );
  };
}

const mapStateToProps = state => ({
  isBurgerMenuOpen: getBurgerMenuOpen(state),
  shoppingCartFetching: getShoppingCartFetching(state),
  shoppingCartItems: getShoppingCartItems(state),
  shoppingCartTotal: getShoppingCartTotal(state),
  isAuthenticated: getIsAuthenticated(state)
});

const mapDispatchToProps = dispatch => ({
  /**
   * Sets the burger menu open state
   * @param {boolean} open Whether the burger menu should be open
   * @returns {void}
   */
  setBurgerMenu(open) {
    return dispatch(toggleBurgerMenuAction(open));
  },
  /**
   * Fetches the shopping cart
   * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchShoppingCart(visualize = false) {
    return dispatch(fetchShoppingCart());
  },
  /**
   * Redirects the client to a url
   * @param {string} url The page url to redirect to
   * @returns {void}
   */
  redirect(url) {
    return dispatch(push(url));
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...mapStateToProps,
  ...mapDispatchToProps,
  ...ownProps,
  /**
   * Toggles the mobile burger menu
   * @returns {void}
   */
  toggleBurgerMenu() {
    return mapDispatchToProps.setBurgerMenu(!mapStateToProps.isBurgerMenuOpen);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Header);
