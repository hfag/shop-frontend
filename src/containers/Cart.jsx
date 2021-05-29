import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import universal from "react-universal-component";
import { Helmet } from "react-helmet";
import { Flex, Box } from "reflexbox";
import { defineMessages, useIntl } from "react-intl";

import {
  fetchShoppingCartIfNeeded,
  updateShoppingCart,
  applyCoupon,
  submitOrder
} from "../actions/shopping-cart";
import { fetchCountriesIfNeeded } from "../actions/countries";
import {
  isFetchingShoppingCart,
  getShoppingCartItems,
  getShoppingCartTotal,
  getShoppingCartTaxes,
  getShoppingCartFees,
  getShoppingCartCoupons,
  getShoppingCartShipping,
  getCountries,
  getAccount,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import CartForm from "../components/cart/CartForm";
import CheckoutForm from "../components/cart/CheckoutForm";
import Card from "../components/Card";
import { InputFieldWrapper } from "../components/InputFieldWrapper";
import Button from "../components/Button";
import { pathnamesByLanguage } from "../utilities/urls";
import { trackPageView } from "../utilities/analytics";

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
  },
  couponLabel: {
    id: "Cart.couponLabel",
    defaultMessage: "Gutscheincode / Coupon"
  },
  applyCoupon: {
    id: "Cart.applyCoupon",
    defaultMessage: "Gutscheincode anwenden"
  },
  invalidCoupon: {
    id: "Cart.invalidCoupon",
    defaultMessage: "Ungültiger Gutscheincode"
  }
});

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The cart page
 * @returns {Component} The component
 */

const Cart = React.memo(
  ({
    fetchCountriesIfNeeded,
    fetchShoppingCartIfNeeded,
    language,
    dispatch,
    isFetching,
    items,
    shipping,
    fees,
    coupons,
    taxes,
    total,
    updateShoppingCart,
    applyCoupon,
    submitOrder,
    countries,
    account,
    checkoutValues
  }) => {
    const intl = useIntl();
    const [step, setStep] = useState("cart");
    const [showShipping, setShowShipping] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [couponError, setCouponError] = useState(false);
    const onApplyCoupon = useCallback(
      e => {
        setCouponError(false);
        return applyCoupon(coupon, true).catch(e => {
          setCouponError(true);
          return Promise.reject(e);
        });
      },
      [coupon]
    );

    useEffect(() => {
      fetchCountriesIfNeeded();
      fetchShoppingCartIfNeeded();

      trackPageView();
    }, []);

    const subtotalSum = items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
      <Card>
        <Helmet>
          <title>
            {intl.formatMessage(messages.siteTitle)} - Hauser Feuerschutz AG
          </title>
          <meta
            name="description"
            content={intl.formatMessage(messages.siteDescription)}
          />
          <link
            rel="canonical"
            href={`${ABSOLUTE_URL}/${language}/${pathnamesByLanguage[language].language}`}
          />
        </Helmet>

        <h1>{intl.formatMessage(messages.cart)}</h1>

        <CartForm
          items={items}
          shipping={shipping}
          fees={fees}
          coupons={coupons}
          taxes={taxes}
          subtotalSum={subtotalSum}
          total={total}
          updateShoppingCart={updateShoppingCart}
          enabled={step === "cart"}
          onProceed={() => setStep("checkout")}
          lastRow={null}
        />

        <Flex flexWrap="wrap">
          <Box width={[1, 1, 1 / 2, 1 / 2]}>
            <InputFieldWrapper>
              <label className="input-label" htmlFor="coupon">
                {intl.formatMessage(messages.couponLabel)}{" "}
              </label>
              <input
                id="coupon"
                type="text"
                onChange={e => setCoupon(e.currentTarget.value)}
              />
            </InputFieldWrapper>
            {couponError && intl.formatMessage(messages.invalidCoupon)}
            <Button onClick={onApplyCoupon}>
              {intl.formatMessage(messages.applyCoupon)}
            </Button>
          </Box>
        </Flex>

        {step === "checkout" && (
          <CheckoutForm
            language={language}
            values={checkoutValues}
            setShowShipping={setShowShipping}
            showShipping={showShipping}
            submitOrder={submitOrder}
            countries={countries}
            dispatch={dispatch}
          />
        )}
      </Card>
    );
  }
);

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
    coupons: getShoppingCartCoupons(state),
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
  applyCoupon(coupon, language, visualize = false) {
    return dispatch(applyCoupon(coupon, language, visualize));
  },
  /**
   * Submits an order
   * @param {Object} shippingAddress The shipping address
   * @param {Object} billingAddress All billing address
   * @param {string} [comments] Optional order comments
   * @param {string} language The language string
   * @param {boolean} visualize Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  submitOrder(shippingAddress, billingAddress, comments, language, visualize) {
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
  applyCoupon(coupon, visualize = false) {
    return mapDispatchToProps.applyCoupon(
      coupon,
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Cart);
