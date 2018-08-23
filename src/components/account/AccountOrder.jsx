import React from "react";
import styled from "styled-components";
import ReactIframeResizer from "react-iframe-resizer-super";

import Placeholder from "../Placeholder";

const API_URL = process.env.API_URL;

const OrderWrapper = styled.div`
  iframe {
    border: none;
    overflow-x: scroll !important;
  }
`;
/**
 * An order component
 * @returns {Component} The component
 */
class AccountOrder extends React.PureComponent {
  constructor() {
    super();

    this.state = { placeholder: true };
  }
  render = () => {
    const { orderId } = this.props.match.params;
    const { placeholder } = this.state;

    return (
      <OrderWrapper>
        {placeholder && <Placeholder block />}
        <ReactIframeResizer
          iframeResizerEnable
          iframeResizerOptions={{
            checkOrigin: false,
            autoResize: false,
            resizedCallback: () => this.setState({ placeholder: false }),
            scrolling: true
          }}
          src={`${API_URL}/wp-json/hfag/user-order?orderId=${orderId}&format=html`}
        />
      </OrderWrapper>
    );
  };
}

export default AccountOrder;
