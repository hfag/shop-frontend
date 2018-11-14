import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import Order from "../../components/Order";
import { getOrders } from "../../reducers";

const OrdersWrapper = styled.div`
  h2 {
    margin-top: 0;
  }
`;
/**
 * An order component
 * @returns {Component} The component
 */
class Orders extends React.PureComponent {
  render = () => {
    const { orders } = this.props;

    return (
      <OrdersWrapper>
        <h2>Bestellungen</h2>
        {orders.length === 0 && (
          <div>Sie haben noch keine Bestellung getätigt.</div>
        )}
        <div>{orders.map(order => <Order key={order.id} order={order} />)}</div>
      </OrdersWrapper>
    );
  };
}

const mapStateToProps = state => ({
  orders: getOrders(state)
});

export default connect(mapStateToProps)(Orders);
