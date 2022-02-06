import { ABSOLUTE_URL } from "../utilities/api";
import { AVAILABLE_COUNTRIES } from "../gql/country";
import { AppContext } from "./AppWrapper";
import { CreateAddressInput, Query } from "../schema";
import { GET_ACTIVE_ORDER } from "../gql/order";
import { defineMessages, useIntl } from "react-intl";
import { pathnamesByLanguage } from "../utilities/urls";
import { useRouter } from "next/router";
import Button from "./elements/Button";
import Card from "./layout/Card";
import CartForm from "./cart/CartForm";
import CheckoutAddressForm from "./cart/CheckoutAddressForm";
import CheckoutForm from "./cart/CheckoutForm";
import Head from "next/head";
import Placeholder from "./elements/Placeholder";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import request from "../utilities/request";
import useSWR from "swr";

const messages = defineMessages({
  siteTitle: {
    id: "Cart.siteTitle",
    defaultMessage: "Warenkorb im Shop der Hauser Feuerschutz AG",
  },
  siteDescription: {
    id: "Cart.siteDescription",
    defaultMessage:
      "Sehen Sie welche Produkte Sie bereits im Warenkorb haben, ändern sie deren Anzahl, entfernen ungewollte oder fügen neue hinzu. Anschliessen können Sie Ihre Bestellung absenden.",
  },
  cart: {
    id: "Cart.cart",
    defaultMessage: "Warenkorb",
  },
  searchProduct: {
    id: "Cart.searchProduct",
    defaultMessage: "Suche Produkt",
  },
});

/**
 * The cart page
 */
const Cart: FunctionComponent = React.memo(() => {
  const intl = useIntl();
  const [step, setStep] = useState("cart");
  const { customer: user, token } = useContext(AppContext);
  const router = useRouter();

  const { data: orderData } = useSWR([GET_ACTIVE_ORDER, token], (query) =>
    request<{ activeOrder: Query["activeOrder"] }>(intl.locale, query)
  );

  const { data: countryData } = useSWR(AVAILABLE_COUNTRIES, (query) =>
    request<{ availableCountries: Query["availableCountries"] }>(
      intl.locale,
      query
    )
  );

  return (
    <Card>
      <Head>
        <title>
          {intl.formatMessage(messages.siteTitle)} - Hauser Feuerschutz AG
        </title>
        <meta
          name="description"
          content={intl.formatMessage(messages.siteDescription)}
        />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${intl.locale}/${
            pathnamesByLanguage.cart.languages[intl.locale]
          }`}
        />
      </Head>

      <h1>{intl.formatMessage(messages.cart)}</h1>

      {orderData ? (
        <>
          <CartForm
            intl={intl}
            order={orderData?.activeOrder}
            token={token}
            enabled={step === "cart"}
            onProceed={() => setStep("address")}
            lastRow={null}
          />
          {(step === "address" || step === "checkout") && (
            <CheckoutAddressForm
              intl={intl}
              enabled={true}
              token={token}
              countries={countryData?.availableCountries || []}
              onProceed={() => setStep("checkout")}
              billingAddress={
                (user && user.addresses.find((a) => a.defaultBillingAddress)) ||
                orderData?.activeOrder.billingAddress
              }
              shippingAddress={
                (user &&
                  user.addresses.find((a) => a.defaultShippingAddress)) ||
                orderData?.activeOrder.shippingAddress
              }
              customer={orderData?.activeOrder?.customer}
              user={user}
            />
          )}
          {step === "checkout" && (
            <CheckoutForm
              intl={intl}
              router={router}
              order={orderData?.activeOrder}
              token={token}
            />
          )}
        </>
      ) : (
        <Placeholder block />
      )}
    </Card>
  );
});

export default Cart;
