import React, {
  useState,
  useEffect,
  FunctionComponent,
  useContext,
} from "react";
import { defineMessages, useIntl } from "react-intl";
import CartForm from "./cart/CartForm";
import Card from "./layout/Card";
import CheckoutAddressForm from "./cart/CheckoutAddressForm";
import CheckoutForm from "./cart/CheckoutForm";
import Button from "./elements/Button";
import SkuSelection from "./SkuSelection";
import { pathnamesByLanguage } from "../utilities/urls";
import { trackPageView } from "../utilities/analytics";
import { Order, CreateAddressInput, Country } from "../schema";
import Head from "next/head";
import { ABSOLUTE_URL } from "../utilities/api";
import { GET_ACTIVE_ORDER } from "../gql/order";
import { AppContext } from "../pages/_app";
import request from "../utilities/request";
import useSWR from "swr";
import Placeholder from "./elements/Placeholder";
import { AVAILABLE_COUNTRIES } from "../gql/country";
import { useRouter } from "next/router";

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
const Cart: FunctionComponent<{}> = React.memo(() => {
  const intl = useIntl();
  const [step, setStep] = useState("cart");
  const { user, token } = useContext(AppContext);
  const [showShipping, setShowShipping] = useState(false);
  const [showSkuSelection, setShowSkuSelection] = useState(false);
  const [
    billingAddress,
    setBillingAddress,
  ] = useState<CreateAddressInput | null>(null);
  const router = useRouter();

  const {
    data: orderData,
  }: { data?: { activeOrder: Order | null }; error?: any } = useSWR(
    [GET_ACTIVE_ORDER, token],
    (query) => request(intl.locale, query)
  );

  const {
    data: countryData,
  }: {
    data?: { availableCountries: Country[] };
    error?: any;
  } = useSWR(AVAILABLE_COUNTRIES, (query) => request(intl.locale, query));

  useEffect(() => {
    trackPageView();
  }, []);

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

      {showSkuSelection && step === "cart" && (
        <div>
          <SkuSelection />
          <hr />
        </div>
      )}

      {orderData ? (
        <>
          <CartForm
            intl={intl}
            order={orderData?.activeOrder}
            token={token}
            enabled={step === "cart"}
            onProceed={() => setStep("address")}
            lastRow={
              !showSkuSelection &&
              step === "cart" && (
                <Button onClick={() => setShowSkuSelection(true)} state="">
                  {intl.formatMessage(messages.searchProduct)}
                </Button>
              )
            }
          />
          {(step === "address" || step === "checkout") && (
            <CheckoutAddressForm
              intl={intl}
              enabled={step === "address"}
              account={user}
              token={token}
              showShipping={showShipping}
              setShowShipping={setShowShipping}
              setBillingAddress={setBillingAddress}
              countries={countryData?.availableCountries || []}
              onProceed={() => setStep("checkout")}
              billingAddress={orderData?.activeOrder.billingAddress}
              shippingAddress={orderData?.activeOrder.shippingAddress}
              customer={orderData?.activeOrder?.customer}
            />
          )}
          {step === "checkout" && (
            <CheckoutForm
              intl={intl}
              router={router}
              order={orderData?.activeOrder}
              account={user}
              token={token}
              billingAddress={billingAddress}
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
