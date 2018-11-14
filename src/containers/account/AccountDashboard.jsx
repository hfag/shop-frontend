import React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "grid-styled";
import styled from "styled-components";

import Address from "../../components/Address";
import Button from "../../components/Button";
import Order from "../../components/Order";
import { getOrders } from "../../reducers";
import Link from "../../components/Link";

const DashboardWrapper = styled.div`
  .no-margin {
    margin: 0;
  }
  .no-margin-top {
    margin-top: 0;
  }
`;

/**
 * The login page
 * @returns {Component} The component
 */
class AccountDashboard extends React.PureComponent {
  render = () => {
    const {
      dispatch,
      accountDetails: { firstName, lastName, email },
      billingAddress,
      shippingAddress,
      orders
    } = this.props;

    const billingEmpty = Object.keys(billingAddress).reduce(
      (empty, key) => empty || billingAddress[key] !== ""
    );

    const shippingEmpty = Object.keys(shippingAddress).reduce(
      (empty, key) => empty || shippingAddress[key] !== ""
    );

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
                Wir wissen noch nicht viel über Sie. Wenn Sie mit Ihrem Namen
                angesprochen werden möchten, können Sie{" "}
                <Link to="/konto/details">hier</Link> Ihren Namen hinterlegen.
              </div>
            )}

            <br />
            <Flex flexWrap="wrap">
              <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
                <h4 className="no-margin">Rechnung</h4>
                {billingEmpty ? (
                  <div>
                    Sie haben noch keine Rechnungsaddresse hinterlegt. Falls sie
                    möchten dass diese bei jeder Bestellung von selbst
                    ausgefüllt wird, fügen Sie{" "}
                    <Link to="/konto/rechnungsadresse">hier</Link> eine hinzu.
                  </div>
                ) : (
                  <Address address={billingAddress} />
                )}
              </Box>
              {!shippingEmpty && (
                <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
                  <h4 className="no-margin">Lieferung</h4>
                  <Address address={shippingAddress} />
                </Box>
              )}
            </Flex>
          </Box>
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
            <h2 className="no-margin-top">Letzte 3 Bestellungen</h2>
            {orders.length === 0 && (
              <div>Sie haben noch keine Bestellung getätigt.</div>
            )}
            {orders
              .sort((a, b) => a.created - b.created)
              .slice(0, 3)
              .map(order => <Order key={order.id} order={order} compact />)}
          </Box>
        </Flex>
      </DashboardWrapper>
    );
  };
}

const mapStateToProps = state => ({
  orders: getOrders(state)
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDashboard);
