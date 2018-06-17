import React from "react";
import { connect } from "react-redux";

import {
  fetchShoppingCart,
  updateShoppingCartItem
} from "../actions/shopping-cart";
import {
  getShoppingCartFetching,
  getShoppingCartItems,
  getShoppingCartTotal,
  getShoppingCartTaxes,
  getShoppingCartFees,
  getShoppingCartShipping
} from "../reducers";
import Container from "../components/Container";
import CartForm from "../components/cart/CartForm";
import CheckoutForm from "../components/cart/CheckoutForm";
import Card from "../components/Card";

/**
 * The cart page
 * @returns {Component} The component
 */
class Cart extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      step: "cart",
      showShipping: false
    };
  }

  /**
   * Sets whether additional shipping address values should be displayed
   * @param {boolean} showShipping Whether the shiping address should be shown
   * @returns {void}
   */
  setShowShipping = showShipping => this.setState({ showShipping });

  render = () => {
    const {
      dispatch,
      isFetching,
      items,
      shipping,
      fees,
      taxes,
      total,
      updateShoppingCartItem
    } = this.props;
    const { step, showShipping } = this.state;

    const subtotalSum = items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
      <Container>
        <Card>
          <h1>Warenkorb</h1>
          <CartForm
            items={items}
            shipping={shipping}
            fees={fees}
            taxes={taxes}
            subtotalSum={subtotalSum}
            total={total}
            updateShoppingCartItem={updateShoppingCartItem}
            enabled={step === "cart"}
            onProceed={() => this.setState({ step: "checkout" })}
          />
          {step === "checkout" && (
            <CheckoutForm
              setShowShipping={this.setShowShipping}
              showShipping={showShipping}
              items={items}
            />
          )}
        </Card>
      </Container>
    );
  };
}

const mapStateToProps = state => ({
  isFetching: getShoppingCartFetching(state),
  items: getShoppingCartItems(state),
  total: getShoppingCartTotal(state),
  taxes: getShoppingCartTaxes(state),
  fees: getShoppingCartFees(state),
  shipping: getShoppingCartShipping(state)
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  /**
   * Fetches the shopping cart
   * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchShoppingCart(visualize = false) {
    return dispatch(fetchShoppingCart(visualize));
  },
  /**
   * Updates the shopping cart
   * @param {Array<Object>} items All cart items
   * @param {*} visualize Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  updateShoppingCartItem(items, visualize = false) {
    return dispatch(updateShoppingCartItem(items, visualize));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
