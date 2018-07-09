import React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "grid-styled";
import styled from "styled-components";

import Address from "../../components/Address";
import Button from "../../components/Button";
import Order from "../../components/Order";
import { getOrders } from "../../reducers";

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
  constructor() {
    super();
    this.state = { registered: false };
  }
  render = () => {
    const {
      dispatch,
      accountDetails: { firstName, lastName, email },
      billingAddress,
      shippingAddress,
      orders
    } = this.props;

    return (
      <DashboardWrapper>
        <Flex flexWrap="wrap">
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
            <h2 className="no-margin">
              {firstName} {lastName}
            </h2>
            <div>{email}</div>
            <br />
            <Flex flexWrap="wrap">
              <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
                <h4 className="no-margin">Rechnung</h4>
                <Address address={billingAddress} />
              </Box>
              <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
                <h4 className="no-margin">Lieferung</h4>
                <Address address={shippingAddress} />
              </Box>
            </Flex>
          </Box>
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
            <h2 className="no-margin-top">Letzte Bestellungen</h2>
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
