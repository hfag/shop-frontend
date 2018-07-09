import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import ReactIframeResizer from "react-iframe-resizer-super";

const API_URL = process.env.API_URL;

const OrderWrapper = styled.div`
  iframe {
    width: 100%;
    height: 100%;

    border: none;
  }
`;
/**
 * An order component
 * @returns {Component} The component
 */
class AccountOrder extends React.PureComponent {
  render = () => {
    const { orderId } = this.props.match.params;

    return (
      <OrderWrapper>
        <ReactIframeResizer
          iframeResizerEnable
          iframeResizerOptions={{ checkOrigin: false, autoResize: false }}
          src={`${API_URL}/wp-json/hfag/user-order?orderId=${orderId}&format=html`}
        />
      </OrderWrapper>
    );
  };
}

export default AccountOrder;
