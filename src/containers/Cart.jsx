import React from "react";
import { connect } from "react-redux";
import universal from "react-universal-component";
import { Helmet } from "react-helmet";

import {
  fetchShoppingCart,
  updateShoppingCartItem,
  submitOrder
} from "../actions/shopping-cart";
import { fetchCountries } from "../actions/countries";
import {
  getShoppingCartFetching,
  getShoppingCartItems,
  getShoppingCartTotal,
  getShoppingCartTaxes,
  getShoppingCartFees,
  getShoppingCartShipping,
  getCountries,
  getAccount
} from "../reducers";
import CartForm from "../components/cart/CartForm";
import CheckoutForm from "../components/cart/CheckoutForm";
import Card from "../components/Card";
import Button from "../components/Button";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

const SkuSelection = universal(props =>
  import(/* webpackChunkName: "sku-selection" */ "./SkuSelection")
);

/**
 * The cart page
 * @returns {Component} The component
 */
class Cart extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      step: "cart",
      showShipping: false,
      showSkuSelection: false
    };
  }

  componentDidMount = () => {
    this.props.fetchCountries();
  };

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
      updateShoppingCartItem,
      submitOrder,
      countries,
      account,
      checkoutValues
    } = this.props;
    const { step, showShipping, showSkuSelection } = this.state;

    const subtotalSum = items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
      <Card>
        <Helmet>
          <title>Warenkorb im Shop der Hauser Feuerschutz AG</title>
          <meta
            name="description"
            content="Sehen Sie welche Produkte Sie bereits im Warenkorb haben, ändern sie deren Anzahl, entfernen ungewollte oder fügen neue hinzu. Anschliessen können Sie Ihre Bestellung absenden."
          />
          <link rel="canonical" href={ABSOLUTE_URL + "/warenkorb"} />
        </Helmet>

        <h1>Warenkorb</h1>

        {showSkuSelection && (
          <div>
            <SkuSelection />
            <hr />
          </div>
        )}

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
          lastRow={
            !showSkuSelection && (
              <Button
                onClick={() => this.setState({ showSkuSelection: true })}
                state=""
              >
                Suche nach Produkt
              </Button>
            )
          }
        />

        {step === "checkout" && (
          <CheckoutForm
            values={checkoutValues}
            setShowShipping={this.setShowShipping}
            showShipping={showShipping}
            submitOrder={submitOrder}
            countries={countries}
            dispatch={dispatch}
          />
        )}
      </Card>
    );
  };
}

const mapStateToProps = state => {
  const account = getAccount(state);

  return {
    isFetching: getShoppingCartFetching(state),
    items: getShoppingCartItems(state),
    total: getShoppingCartTotal(state),
    taxes: getShoppingCartTaxes(state),
    fees: getShoppingCartFees(state),
    shipping: getShoppingCartShipping(state),
    countries: getCountries(state),
    account: account,
    checkoutValues:
      account.billing && account.shipping
        ? {
            ...Object.keys(account.billing).reduce((object, key) => {
              object["billing_" + key] = account.billing[key];
              return object;
            }, {}),
            ...Object.keys(account.shipping).reduce((object, key) => {
              object["shipping_" + key] = account.shipping[key];
              return object;
            }, {})
          }
        : {}
  };
};

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
   * @param {boolean} visualize Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  updateShoppingCartItem(items, visualize = false) {
    return dispatch(updateShoppingCartItem(items, visualize));
  },
  /**
   * Submits an order
   * @param {Object} shippingAddress The shipping address
   * @param {Object} billingAddress All billing address
   * @param {string} [comments] Optional order comments
   * @returns {Promise} The fetch promise
   */
  submitOrder(shippingAddress, billingAddress, comments) {
    return dispatch(submitOrder(shippingAddress, billingAddress, comments));
  },
  /**
   * Fetches all countries
   * @param {boolean} [visualize] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchCountries(visualize = false) {
    return dispatch(fetchCountries(visualize));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
