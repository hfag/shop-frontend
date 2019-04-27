import React, { useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Flex, Box } from "grid-styled";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { defineMessages, injectIntl } from "react-intl";

import { getCountries, getLanguageFetchString, getLanguage } from "../reducers";
import { fetchCountriesIfNeeded } from "../actions/countries";
import { getIsAuthenticated, getAccount } from "../reducers";
import Container from "../components/Container";
import Card from "../components/Card";
import Link from "../components/Link";
import AccountOrders from "../containers/account/AccountOrders";
import AccountOrder from "../components/account/AccountOrder";
import AccountDashboard from "../containers/account/AccountDashboard";
import AccountForm from "../components/account/AccountForm";
import AddressForm from "../components/account/AddressForm";
import { updateAccount, updateAddress, fetchAccount } from "../actions/user";
import { fetchOrders } from "../actions/orders";
import { pathnamesByLanguage } from "../utilities/urls";
import address from "../i18n/address";
import order from "../i18n/order";
import user from "../i18n/user";

const messages = defineMessages({
  siteTitle: {
    id: "Account.siteTitle",
    defaultMessage: "Mein Kundenkonto bei der Hauser Feuerschutz AG"
  },
  siteDescription: {
    id: "Account.siteDescription",
    defaultMessage:
      "Verwalten Sie hier Ihr Kundenkonto bei der Hauser Feuerschutz AG. Beispielsweise können Sie die Lieferadresse anpassen."
  },
  myAccount: {
    id: "Account.myAccount",
    defaultMessage: "Mein Kundenkonto"
  },
  overview: {
    id: "Account.overview",
    defaultMessage: "Übersicht"
  },
  details: {
    id: "Account.details",
    defaultMessage: "Details"
  }
});

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

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

const AccountContainer = styled.div`
  h1 {
    margin-top: 0;
  }
`;

/**
 * The account page
 * @returns {Component} The component
 */

const Account = React.memo(
  injectIntl(
    ({
      language,
      countries,
      accountDetails,
      billingAddress,
      shippingAddress,
      updateAccount,
      updateAddress,
      match: { url },
      isAuthenticated,
      redirectToLogin,
      fetchCountriesIfNeeded,
      fetchAccount,
      fetchOrders,
      intl
    }) => {
      useEffect(() => {
        if (!isAuthenticated) {
          return redirectToLogin();
        }

        fetchCountriesIfNeeded();
        fetchAccount();
        fetchOrders();
      }, []);

      return (
        <AccountContainer>
          <Helmet
            title={intl.formatMessage(messages.siteTitle)}
            meta={[
              {
                name: "description",
                content: intl.formatMessage(messages.siteDescription)
              }
            ]}
            link={[
              {
                rel: "canonical",
                href: `${ABSOLUTE_URL}/${language}/${
                  pathnamesByLanguage[language].account
                }`
              }
            ]}
          />
          <Flex flexWrap="wrap">
            <Box width={[1, 1 / 2, 1 / 3, 1 / 3]} pr={[0, 4, 4, 4]}>
              <Card>
                <h1>{intl.formatMessage(messages.myAccount)}</h1>
                <ProfileNavigation>
                  <li>
                    <Link to={url}>
                      {intl.formatMessage(messages.overview)}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${url}/${pathnamesByLanguage[language].details}`}
                    >
                      {intl.formatMessage(messages.details)}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${url}/${
                        pathnamesByLanguage[language].billingAddress
                      }`}
                    >
                      {intl.formatMessage(address.billingAddress)}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${url}/${
                        pathnamesByLanguage[language].shippingAddress
                      }`}
                    >
                      {intl.formatMessage(address.shippingAddress)}
                    </Link>
                  </li>
                  <li>
                    <Link to={`${url}/${pathnamesByLanguage[language].orders}`}>
                      {intl.formatMessage(order.orders)}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${language}/${
                        pathnamesByLanguage[language].logout
                      }`}
                    >
                      {intl.formatMessage(user.logout)}
                    </Link>
                  </li>
                </ProfileNavigation>
              </Card>
            </Box>
            <Box width={[1, 1 / 2, 2 / 3, 2 / 3]}>
              <Card>
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
                    path={`${url}/${pathnamesByLanguage[language].details}`}
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
                    path={`${url}/${
                      pathnamesByLanguage[language].billingAddress
                    }`}
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
                    path={`${url}/${
                      pathnamesByLanguage[language].shippingAddress
                    }`}
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
                  <Route
                    path={`${url}/${pathnamesByLanguage[language].orders}`}
                    component={AccountOrders}
                  />
                  <Route
                    path={`${url}/${
                      pathnamesByLanguage[language].orders
                    }/:orderId`}
                    component={AccountOrder}
                  />
                </Switch>
              </Card>
            </Box>
          </Flex>
        </AccountContainer>
      );
    }
  )
);

const mapStateToProps = state => {
  const account = getAccount(state);
  return {
    language: getLanguage(state),
    languageFetchString: getLanguageFetchString(state),
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
   * @param {string} language The language
   * @returns {void}
   */
  redirectToLogin(language) {
    return dispatch(
      push(`/${language}/${pathnamesByLanguage[language].login}`)
    );
  },
  /**
   * Fetches all countries if needed
   * @param {string} language The language string
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchCountriesIfNeeded(language, visualize = true) {
    return dispatch(fetchCountriesIfNeeded(language, visualize));
  },
  /**
   * Fetches the user account
   * @param {string} language The language string
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAccount(language, visualize = true) {
    return dispatch(fetchAccount(language, visualize));
  },
  /**
   * Fetches the user's orders
   * @param {string} language The language string
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchOrders(language, visualize = true) {
    return dispatch(fetchOrders(language, visualize));
  },
  /**
   * Updates the user's account
   * @param {string} firstName The user's new first name
   * @param {string} lastName The user's new last name
   * @param {string} email The user's new email
   * @param {string} password The user's current password
   * @param {string} newPassword The user's new password
   * @param {string} language The language string
   * @param {boolean} [visualize=false] Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  updateAccount(
    firstName,
    lastName,
    email,
    password,
    newPassword,
    language,
    visualize = false
  ) {
    return dispatch(
      updateAccount(
        firstName,
        lastName,
        email,
        password,
        newPassword,
        language,
        visualize
      )
    );
  },
  /**
   * Updates the user's address
   * @param {string} language The language string
   * @param {Object} address The address values
   * @param {string} type The address type (billing, shipping)
   * @param {boolean} [visualize=false] Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  updateAddress(language, address, type, visualize = false) {
    return dispatch(updateAddress(address, type, language, visualize));
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Redirects the client to the login page
   * @returns {void}
   */
  redirectToLogin() {
    return mapDispatchToProps.redirectToLogin(mapStateToProps.language);
  },
  /**
   * Fetches all countries if needed
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchCountriesIfNeeded(visualize = true) {
    return mapDispatchToProps.fetchCountriesIfNeeded(
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Fetches the user account
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAccount(visualize = true) {
    return mapDispatchToProps.fetchAccount(
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Fetches the user's orders
   * @param {boolean} [visualize=true] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchOrders(visualize = true) {
    return mapDispatchToProps.fetchOrders(
      mapStateToProps.languageFetchString,
      visualize
    );
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
    return mapDispatchToProps.updateAccount(
      firstName,
      lastName,
      email,
      password,
      newPassword,
      mapStateToProps.languageFetchString,
      visualize
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
    return mapDispatchToProps.updateAddress(
      address,
      type,
      mapStateToProps.languageFetchString,
      visualize
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Account);
