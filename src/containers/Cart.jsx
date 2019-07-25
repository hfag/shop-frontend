import React from "react";
import { connect } from "react-redux";
import universal from "react-universal-component";
import { Helmet } from "react-helmet";
import { defineMessages, injectIntl } from "react-intl";

import {
  fetchShoppingCartIfNeeded,
  updateShoppingCart,
  submitOrder
} from "../actions/shopping-cart";
import { fetchCountriesIfNeeded } from "../actions/countries";
import {
  isFetchingShoppingCart,
  getShoppingCartItems,
  getShoppingCartTotal,
  getShoppingCartTaxes,
  getShoppingCartFees,
  getShoppingCartShipping,
  getCountries,
  getAccount,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import CartForm from "../components/cart/CartForm";
import CheckoutForm from "../components/cart/CheckoutForm";
import Card from "../components/Card";
import Button from "../components/Button";
import { pathnamesByLanguage } from "../utilities/urls";

const messages = defineMessages({
  siteTitle: {
    id: "Cart.siteTitle",
    defaultMessage: "Warenkorb im Shop der Hauser Feuerschutz AG"
  },
  siteDescription: {
    id: "Cart.siteDescription",
    defaultMessage:
      "Sehen Sie welche Produkte Sie bereits im Warenkorb haben, ändern sie deren Anzahl, entfernen ungewollte oder fügen neue hinzu. Anschliessen können Sie Ihre Bestellung absenden."
  },
  cart: {
    id: "Cart.cart",
    defaultMessage: "Warenkorb"
  },
  searchProduct: {
    id: "Cart.searchProduct",
    defaultMessage: "Suche Produkt"
  }
});

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
    this.props.fetchCountriesIfNeeded();
    this.props.fetchShoppingCartIfNeeded();
  };

  /**
   * Sets whether additional shipping address values should be displayed
   * @param {boolean} showShipping Whether the shiping address should be shown
   * @returns {void}
   */
  setShowShipping = showShipping => this.setState({ showShipping });

  render = () => {
    const {
      language,
      dispatch,
      isFetching,
      items,
      shipping,
      fees,
      taxes,
      total,
      updateShoppingCart,
      submitOrder,
      countries,
      account,
      checkoutValues,
      intl
    } = this.props;
    const { step, showShipping, showSkuSelection } = this.state;

    const subtotalSum = items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
      <Card>
        <Helmet>
          <title>{intl.formatMessage(messages.siteTitle)}</title>
          <meta
            name="description"
            content={intl.formatMessage(messages.siteDescription)}
          />
          <link
            rel="canonical"
            href={`${ABSOLUTE_URL}/${language}/${
              pathnamesByLanguage[language].language
            }`}
          />
        </Helmet>

        <h1>{intl.formatMessage(messages.cart)}</h1>

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
          updateShoppingCart={updateShoppingCart}
          enabled={step === "cart"}
          onProceed={() => this.setState({ step: "checkout" })}
          lastRow={
            !showSkuSelection && (
              <Button
                onClick={() => this.setState({ showSkuSelection: true })}
                state=""
              >
                {intl.formatMessage(messages.searchProduct)}
              </Button>
            )
          }
        />

        {step === "checkout" && (
          <CheckoutForm
            language={language}
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
    language: getLanguage(state),
    languageFetchString: getLanguageFetchString(state),
    isFetching: isFetchingShoppingCart(state),
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
   * @param {string} language The language string
   * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchShoppingCartIfNeeded(language, visualize = false) {
    return dispatch(fetchShoppingCartIfNeeded(language, visualize));
  },
  /**
   * Updates the shopping cart
   * @param {Array<Object>} items All cart items
   * @param {Array<Object>} oldItems The old cart items
   * @param {string} language The language string
   * @param {boolean} visualize Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  updateShoppingCart(items, oldItems, language, visualize = false) {
    return dispatch(updateShoppingCart(items, oldItems, language, visualize));
  },
  /**
   * Submits an order
   * @param {string} language The language string
   * @param {Object} shippingAddress The shipping address
   * @param {Object} billingAddress All billing address
   * @param {string} [comments] Optional order comments
   * @param {boolean} visualize Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  submitOrder(language, shippingAddress, billingAddress, comments, visualize) {
    return dispatch(
      submitOrder(
        shippingAddress,
        billingAddress,
        comments,
        language,
        visualize
      )
    );
  },
  /**
   * Fetches all countries if needed
   * @param {string} language The language string
   * @param {boolean} [visualize] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchCountriesIfNeeded(language, visualize = false) {
    return dispatch(fetchCountriesIfNeeded(language, visualize));
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches the shopping cart
   * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchShoppingCartIfNeeded(visualize = false) {
    return mapDispatchToProps.fetchShoppingCartIfNeeded(
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Updates the shopping cart
   * @param {Array<Object>} items All cart items
   * @param {boolean} visualize Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  updateShoppingCart(items, visualize = false) {
    return mapDispatchToProps.updateShoppingCart(
      items,
      mapStateToProps.items,
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Submits an order
   * @param {Object} shippingAddress The shipping address
   * @param {Object} billingAddress All billing address
   * @param {string} [comments] Optional order comments
   * @param {boolean} visualize Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  submitOrder(shippingAddress, billingAddress, comments, visualize = false) {
    return mapDispatchToProps.submitOrder(
      shippingAddress,
      billingAddress,
      comments,
      mapStateToProps.languageFetchString,
      visualize
    );
  },
  /**
   * Fetches all countries if needed
   * @param {boolean} [visualize] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchCountriesIfNeeded(visualize = false) {
    return mapDispatchToProps.fetchCountriesIfNeeded(
      mapStateToProps.languageFetchString,
      visualize
    );
  }
});

const TranslatedCart = injectIntl(Cart);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TranslatedCart);
