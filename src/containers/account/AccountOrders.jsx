import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { defineMessages, injectIntl } from "react-intl";

import Order from "../../components/Order";
import { getOrders } from "../../reducers";
import order from "../../i18n/order";

const OrdersWrapper = styled.div`
  h2 {
    margin-top: 0;
  }
`;

const Orders = React.memo(
  injectIntl(({ orders, intl }) => {
    return (
      <OrdersWrapper>
        <h2>{intl.formatMessage(order.orders)}</h2>
        {orders.length === 0 && <div>{intl.formatMessage(order.noOrders)}</div>}
        <div>
          {orders.map(order => (
            <Order key={order.id} order={order} language={intl.locale} />
          ))}
        </div>
      </OrdersWrapper>
    );
  })
);

const mapStateToProps = state => ({
  orders: getOrders(state)
});

export default connect(mapStateToProps)(Orders);
