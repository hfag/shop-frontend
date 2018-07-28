import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Flex, Box } from "grid-styled";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";

import { getCountries } from "../reducers";
import { fetchCountries } from "../actions/countries";
import { getIsAuthenticated, getAccount } from "../reducers";
import Container from "../components/Container";
import Card from "../components/Card";
import Link from "../components/Link";
import AccountOrders from "../containers/account/AccountOrders";
import AccountOrder from "../components/account/AccountOrder";
import AccountDashboard from "../containers/account/AccountDashboard";
import AccountForm from "../components/account/AccountForm";
import AddressForm from "../components/account/AddressForm";
import AccountResellerDashboard from "./account/AccountResellerDashboard";
import { updateAccount, updateAddress, fetchAccount } from "../actions/user";
import { fetchOrders } from "../actions/orders";

const ProfileNavigation = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;

  border: #eee 1px solid;
  border-radius: 5px;

  li {
    padding: 0.25rem 0.5rem;
    border-bottom: #eee 1px solid;

    &:last-child {
      border-bottom: none;
    }
  }
`;

/**
 * The account page
 * @returns {Component} The component
 */
class Account extends React.PureComponent {
  componentDidMount = () => {
    const {
      isAuthenticated,
      redirectToLogin,
      fetchCountries,
      fetchAccount,
      fetchOrders
    } = this.props;

    if (!isAuthenticated) {
      return redirectToLogin();
    }

    fetchCountries();
    fetchAccount();
    fetchOrders();
  };

  render = () => {
    const {
      countries,
      accountDetails,
      billingAddress,
      shippingAddress,
      updateAccount,
      updateAddress,
      match: { url }
    } = this.props;

    return (
      <Container>
        <Card>
          <h1>Mein Kundenkonto</h1>
          <Flex flexWrap="wrap">
            <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} pr={4}>
              <ProfileNavigation>
                <li>
                  <Link to={url}>Übersicht</Link>
                </li>
                <li>
                  <Link to={`${url}/details`}>Details</Link>
                </li>
                <li>
                  <Link to={`${url}/rechnungsadresse`}>Rechnungsadresse</Link>
                </li>
                <li>
                  <Link to={`${url}/lieferadresse`}>Lieferadresse</Link>
                </li>
                <li>
                  <Link to={`${url}/bestellungen`}>Bestellungen</Link>
                </li>
                <li>
                  <Link to={`${url}/wiederverkäufer`}>Wiederverkäufer</Link>
                </li>
                <li>
                  <Link to="/logout">Abmelden</Link>
                </li>
              </ProfileNavigation>
            </Box>
            <Box width={[1, 1 / 2, 2 / 3, 2 / 3]} pr={3}>
              <Switch>
                <Route
                  exact
                  path={url}
                  render={props => (
                    <AccountDashboard
                      {...props}
                      accountDetails={accountDetails}
                      billingAddress={billingAddress}
                      shippingAddress={shippingAddress}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${url}/details`}
                  render={props => (
                    <AccountForm
                      {...props}
                      updateAccount={updateAccount}
                      values={accountDetails}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${url}/rechnungsadresse`}
                  render={props => (
                    <AddressForm
                      {...props}
                      updateAddress={updateAddress}
                      type="billing"
                      countries={countries}
                      values={billingAddress}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${url}/lieferadresse`}
                  render={props => (
                    <AddressForm
                      {...props}
                      updateAddress={updateAddress}
                      type="shipping"
                      countries={countries}
                      values={shippingAddress}
                    />
                  )}
                />
                <Route path={`${url}/bestellungen`} component={AccountOrders} />
                <Route
                  path={`${url}/bestellung/:orderId`}
                  component={AccountOrder}
                />
                <Route
                  path={`${url}/wiederverkäufer`}
                  component={AccountResellerDashboard}
                />
              </Switch>
            </Box>
          </Flex>
        </Card>
      </Container>
    );
  };
}

const mapStateToProps = state => {
  const account = getAccount(state);
  return {
    isAuthenticated: getIsAuthenticated(state),
    accountDetails: {
      firstName: account ? account.firstName : "",
      lastName: account ? account.lastName : "",
      email: account ? account.email : ""
    },
    billingAddress: account.billing || {},
    shippingAddress: account.shipping || {},
    countries: getCountries(state)
  };
};

const mapDispatchToProps = dispatch => ({
  /**
   * Redirects the client to the login page
   * @returns {void}
   */
  redirectToLogin() {
    return dispatch(push("/login"));
  },
  /**
   * Fetches all countries
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchCountries(visualize = true) {
    return dispatch(fetchCountries(visualize));
  },
  /**
   * Fetches the user account
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAccount(visualize = true) {
    return dispatch(fetchAccount(visualize));
  },
  /**
   * Fetches the user's orders
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchOrders(visualize = true) {
    return dispatch(fetchOrders(visualize));
  },
  /**
   * Updates the user's account
   * @param {string} firstName The user's new first name
   * @param {string} lastName The user's new last name
   * @param {string} email The user's new email
   * @param {string} password The user's current password
   * @param {string} newPassword The user's new password
   * @param {boolean} [visualize=false] Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  updateAccount(
    firstName,
    lastName,
    email,
    password,
    newPassword,
    visualize = false
  ) {
    return dispatch(
      updateAccount(
        firstName,
        lastName,
        email,
        password,
        newPassword,
        visualize
      )
    );
  },
  /**
   * Updates the user's address
   * @param {Object} address The address values
   * @param {string} type The address type (billing, shipping)
   * @param {boolean} [visualize=false] Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  updateAddress(address, type, visualize = false) {
    return dispatch(updateAddress(address, type, visualize));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
