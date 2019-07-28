import React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "grid-styled";
import styled from "styled-components";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";

import Address from "../../components/Address";
import Button from "../../components/Button";
import Order from "../../components/Order";
import { getOrders, getLanguage } from "../../reducers";
import Link from "../../components/Link";
import { pathnamesByLanguage } from "../../utilities/urls";
import order from "../../i18n/order";

const messages = defineMessages({
  here: {
    id: "AccountDashboard.here",
    defaultMessage: "hier"
  }
});

const DashboardWrapper = styled.div`
  .no-margin {
    margin: 0;
  }
  .no-margin-top {
    margin-top: 0;
  }
`;

const AccountDashboard = React.memo(
  injectIntl(
    ({
      language,
      dispatch,
      accountDetails: { firstName, lastName, email },
      billingAddress,
      shippingAddress,
      orders,
      intl
    }) => {
      const billingEmpty = Object.keys(billingAddress)
        .filter(key => key !== "email")
        .reduce((empty, key) => empty && billingAddress[key] == "", true);

      const shippingEmpty = Object.keys(shippingAddress)
        .filter(key => key !== "email")
        .reduce((empty, key) => empty && shippingAddress[key] == "", true);

      return (
        <DashboardWrapper>
          <Flex flexWrap="wrap">
            <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
              {firstName && lastName && email ? (
                <div>
                  <h2 className="no-margin">
                    {firstName} {lastName}
                  </h2>
                  <div>{email}</div>
                </div>
              ) : (
                <div>
                  <FormattedMessage
                    id="AccountDashboard.provideName"
                    defaultMessage="Wir wissen noch nicht viel über Sie. Wenn Sie mit Ihrem Namen angesprochen werden möchten, können Sie {here} Ihren Namen hinterlegen."
                    values={{
                      here: (
                        <Link
                          to={`/${language}/${
                            pathnamesByLanguage[language].account
                          }/${pathnamesByLanguage[language].details}`}
                        >
                          {intl.formatMessage(messages.here)}
                        </Link>
                      )
                    }}
                  />
                </div>
              )}
              <br />
              <Flex flexWrap="wrap">
                <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
                  <h4 className="no-margin">
                    {intl.formatMessage(order.invoice)}
                  </h4>
                  {billingEmpty ? (
                    <div>
                      <FormattedMessage
                        id="AccountDashboard.provideAddress"
                        defaultMessage="Sie haben noch keine Rechnungsaddresse hinterlegt. Falls sie möchten dass diese bei jeder Bestellung von selbst ausgefüllt wird, fügen Sie {here} eine hinzu."
                        values={{
                          here: (
                            <Link
                              to={`/${language}/${
                                pathnamesByLanguage[language].account
                              }/${
                                pathnamesByLanguage[language].billingAddress
                              }`}
                            >
                              {intl.formatMessage(messages.here)}
                            </Link>
                          )
                        }}
                      />
                    </div>
                  ) : (
                    <Address address={billingAddress} />
                  )}
                </Box>
                {!shippingEmpty && (
                  <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
                    <h4 className="no-margin">
                      {intl.formatMessage(order.shipping)}
                    </h4>
                    <Address address={shippingAddress} />
                  </Box>
                )}
              </Flex>
            </Box>
            <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
              <h2 className="no-margin-top">
                {intl.formatMessage(order.lastThreeOrders)}
              </h2>
              {orders.length === 0 && (
                <div>{intl.formatMessage(order.noOrders)}</div>
              )}
              {orders
                .sort((a, b) => a.created - b.created)
                .slice(0, 3)
                .map(order => (
                  <Order key={order.id} order={order} compact />
                ))}
            </Box>
          </Flex>
        </DashboardWrapper>
      );
    }
  )
);

const mapStateToProps = state => ({
  language: getLanguage(state),
  orders: getOrders(state)
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDashboard);
