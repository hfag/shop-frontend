import * as yup from "yup";
import { Field, Form, FormikProps, withFormik } from "formik";
import { IntlShape, defineMessages } from "react-intl";
import React, { useEffect, useMemo } from "react";

import {
  ErrorCode,
  Mutation,
  Order,
  Query,
  ShippingMethodQuote,
} from "../../schema";
import { FACTOR_PLUS_TAXES, FACTOR_TAXES } from "../../utilities/taxes";
import {
  GET_ACTIVE_ORDER,
  ORDER_ADD_PAYMENT,
  ORDER_GET_SHIPPING_METHODS,
  ORDER_SET_CUSTOM_FIELDS,
  ORDER_SET_SHIPPING_METHOD,
  TRANSITION_ORDER_AND_ADD_PAYMENT,
} from "../../gql/order";
import { NextRouter } from "next/router";
import { errorCodeToMessage } from "../../utilities/i18n";
import { mapShippingMethodToOrder } from "./CheckoutAddressForm";
import { pageSlugsByLanguage, pathnamesByLanguage } from "../../utilities/urls";
import Box from "../layout/Box";
import Button from "../elements/Button";
import Flex from "../layout/Flex";
import InlinePage from "../InlinePage";
import InputField from "../form/InputField";
import Placeholder from "../elements/Placeholder";
import Price from "../elements/Price";
import Table from "../elements/Table";
import orderMessages from "../../i18n/order";
import product from "../../i18n/product";
import request from "../../utilities/request";
import useSWR, { mutate } from "swr";

const messages = defineMessages({
  orderComments: {
    id: "CheckoutForm.orderComments",
    defaultMessage: "Bestellnotiz",
  },
  orderCommentsPlaceholder: {
    id: "CheckoutForm.orderCommentsPlaceholder",
    defaultMessage:
      "Anmerkungen zu Ihrer Bestellung, z.B. besondere Hinweise für die Lieferung.",
  },
  paymentMethods: {
    id: "CheckoutForm.paymentMethods",
    defaultMessage: "Zahlungsmethoden",
  },
  shippingMethods: {
    id: "CheckoutForm.shippingMethods",
    defaultMessage: "Liefermethoden",
  },
  acceptTos: {
    id: "CheckoutForm.acceptTos",
    defaultMessage:
      "Ich habe die Allgemeinen Geschäftsbedingungen gelesen und akzeptiere diese *",
  },
  submitOrder: {
    id: "CheckoutForm.submitOrder",
    defaultMessage: "Bestellung abschicken",
  },
  tosMustBeAccepted: {
    id: "CheckoutForm.tosMustBeAccepted",
    defaultMessage: "Die AGBs müssen akzeptiert werden!",
  },
  invalidPaymentMethod: {
    id: "CheckoutForm.invalidPaymentMethod",
    defaultMessage: "Die ausgewählte Zahlungsmethode ist ungültig!",
  },
  pickupWarning: {
    id: "CheckoutForm.pickupWarning",
    defaultMessage:
      "Achtung: Sie haben Abholung als Liefermethode ausgewählt. Für diese Lieferart wird eine Vorauszahlung verlangt.",
  },
});

interface FormValues {
  shippingMethod?: string | null;
  orderComments?: string | null;
  terms?: boolean | null;
  paymentMethod: string;
}

interface IProps {
  intl: IntlShape;
  router: NextRouter;
  token?: string | null;
  values?: FormValues;
  order: Order;
}

/**
 * The inner checkout form
 */
const InnerCheckoutForm = React.memo(
  ({
    status,
    values,
    isValid,
    handleSubmit,
    intl,
    token,
    order,
  }: IProps & FormikProps<FormValues>) => {
    const { data } = useSWR(ORDER_GET_SHIPPING_METHODS, (query) =>
      request<{ eligibleShippingMethods: Query["eligibleShippingMethods"] }>(
        intl.locale,
        query
      )
    );

    useEffect(() => {
      if (values.shippingMethod) {
        request<{
          setOrderShippingMethod: Mutation["setOrderShippingMethod"];
        }>(intl.locale, ORDER_SET_SHIPPING_METHOD, {
          shippingMethodId: values.shippingMethod,
        })
          .then((response) => {
            if ("errorCode" in response.setOrderShippingMethod) {
              return;
            }

            mutate(
              [GET_ACTIVE_ORDER, token],
              { activeOrder: response.setOrderShippingMethod },
              false
            );
          })
          .catch(console.log);
      }
    }, [values.shippingMethod]);

    const shippingMethod: ShippingMethodQuote | null = useMemo(() => {
      if (!data) {
        return null;
      }

      data.eligibleShippingMethods.sort(
        (a, b) =>
          mapShippingMethodToOrder(a.code) - mapShippingMethodToOrder(b.code)
      );

      return (
        data.eligibleShippingMethods.find(
          (m) => m.id === values.shippingMethod
        ) || null
      );
    }, [data, values]);

    useEffect(() => {
      if (shippingMethod?.code == "abholung") {
        window.alert(intl.formatMessage(messages.pickupWarning));
      }
    }, [shippingMethod]);

    const shipping = shippingMethod ? shippingMethod.price : null;

    return (
      <Form>
        <br />
        <InputField
          label={intl.formatMessage(messages.orderComments)}
          name="orderComments"
          required={false}
          placeholder={intl.formatMessage(messages.orderCommentsPlaceholder)}
          component="textarea"
        />
        <h3>{intl.formatMessage(messages.shippingMethods)}</h3>
        <Flex flexWrap="wrap">
          {data ? (
            data.eligibleShippingMethods.map((shippingMethod, index) => (
              <Box
                key={index}
                widths={[1, 1, 1 / 2, 1 / 3, 1 / 4]}
                paddingRight={1}
              >
                <label>
                  <Field
                    name="shippingMethod"
                    type="radio"
                    value={shippingMethod.id}
                    checked={values.shippingMethod === shippingMethod.id}
                  />{" "}
                  {shippingMethod.name} <Price>{shippingMethod.price}</Price>
                </label>
              </Box>
            ))
          ) : (
            <Box widths={[1, 1, 1 / 2, 1 / 3, 1 / 4]} paddingRight={1}>
              <Placeholder block />
            </Box>
          )}
          <Box widths={[1, 1, 1, 1, 1]} paddingRight={1}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  data?.eligibleShippingMethods.find(
                    (method) => method.id === values.shippingMethod
                  )?.description || "",
              }}
            ></div>
          </Box>
        </Flex>
        <h3>{intl.formatMessage(messages.paymentMethods)}</h3>
        <Flex flexWrap="wrap">
          <Box widths={[1, 1, 1 / 2, 1 / 3, 1 / 4]} paddingRight={1}>
            <label>
              <Field
                name="paymentMethod"
                type="radio"
                value="invoice"
                checked={values.paymentMethod === "invoice"}
              />{" "}
              {intl.formatMessage(orderMessages.invoice)}
            </label>
          </Box>
        </Flex>
        <br />
        <InlinePage slug={pageSlugsByLanguage.tos.languages[intl.locale]} />
        <InputField id="terms" name="terms" type="checkbox">
          <label htmlFor="terms">
            {intl.formatMessage(messages.acceptTos)}
          </label>
        </InputField>
        <br />
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{intl.formatMessage(product.subtotal)}</td>
              <td>
                <Price>{order.subTotal}</Price>
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(orderMessages.shipping)}</td>
              <td>{shipping && <Price>{shipping}</Price>}</td>
            </tr>
            <tr>
              <td>{intl.formatMessage(orderMessages.taxes)}</td>
              <td>
                <Price>{order.total * FACTOR_TAXES}</Price>
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(orderMessages.total)}</td>
              <td>
                <Price>{order.total * FACTOR_PLUS_TAXES}</Price>
              </td>
            </tr>
          </tbody>
        </Table>
        <br />
        <Button
          fullWidth
          onClick={handleSubmit}
          controlled
          state={isValid ? status : "disabled"}
        >
          {intl.formatMessage(messages.submitOrder)}
        </Button>
      </Form>
    );
  }
);

const CheckoutForm = withFormik<IProps, FormValues>({
  enableReinitialize: true,
  isInitialValid: false,
  mapPropsToValues: ({ order, values = {} }) => ({
    paymentMethod: "invoice",
    orderComments: order.customFields?.notes,
    ...values,
    shippingMethod: order.shippingLines[0]?.shippingMethod.id || "1",
    terms: false,
  }),

  validationSchema: ({ intl }: { intl: IntlShape }) => {
    return yup.object().shape({
      shippingMethod: yup.string().required(),
      paymentMethod: yup.string().required(),
      terms: yup
        .bool()
        .oneOf([true], intl.formatMessage(messages.tosMustBeAccepted)),
    });
  },
  handleSubmit: async (
    values,
    { props: { intl, token, order, router }, setStatus, setErrors }
  ) => {
    if (!order) {
      return;
    }

    //store order comments
    const response = await request<{
      setOrderCustomFields: Mutation["setOrderCustomFields"];
    }>(intl.locale, ORDER_SET_CUSTOM_FIELDS, {
      input: { customFields: { notes: values.orderComments } },
    });

    if ("errorCode" in response.setOrderCustomFields) {
      setErrors({
        terms: errorCodeToMessage(intl, response.setOrderCustomFields),
      });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
      return;
    }

    if (values.paymentMethod === "invoice") {
      let data: { addPaymentToOrder: Order };

      if (order.state === "ArrangingPayment") {
        const response = await request<{
          addPaymentToOrder: Mutation["addPaymentToOrder"];
        }>(intl.locale, ORDER_ADD_PAYMENT, {
          input: { method: values.paymentMethod, metadata: {} },
        });

        if ("errorCode" in response.addPaymentToOrder) {
          setErrors({
            terms: errorCodeToMessage(intl, response.addPaymentToOrder),
          });
          setStatus("error");
          setTimeout(() => setStatus(""), 300);
          return;
        }

        data = { addPaymentToOrder: response.addPaymentToOrder };
      } else {
        const setShipping = await request<{
          setOrderShippingMethod: Mutation["setOrderShippingMethod"];
        }>(intl.locale, ORDER_SET_SHIPPING_METHOD, {
          shippingMethodId: values.shippingMethod,
        });

        if ("errorCode" in setShipping.setOrderShippingMethod) {
          setErrors({
            shippingMethod: errorCodeToMessage(
              intl,
              setShipping.setOrderShippingMethod
            ),
          });
          setStatus("error");
          setTimeout(() => setStatus(""), 300);
          return;
        }

        const response = await request<{
          transitionOrderToState: Mutation["transitionOrderToState"];
          addPaymentToOrder: Mutation["addPaymentToOrder"];
        }>(intl.locale, TRANSITION_ORDER_AND_ADD_PAYMENT, {
          input: {
            method: values.paymentMethod,
            metadata: {},
          },
        });

        if (!response.transitionOrderToState) {
          setErrors({
            terms: errorCodeToMessage(intl, {
              errorCode: ErrorCode.UnknownError,
            }),
          });
          setStatus("error");
          setTimeout(() => setStatus(""), 300);
          return;
        }

        if ("errorCode" in response.transitionOrderToState) {
          setErrors({
            terms: errorCodeToMessage(intl, response.transitionOrderToState),
          });
          setStatus("error");
          setTimeout(() => setStatus(""), 300);
          return;
        }

        if ("errorCode" in response.addPaymentToOrder) {
          setErrors({
            paymentMethod: errorCodeToMessage(intl, response.addPaymentToOrder),
          });
          setStatus("error");
          setTimeout(() => setStatus(""), 300);
          return;
        }

        data = { addPaymentToOrder: response.addPaymentToOrder };
      }

      mutate(
        [GET_ACTIVE_ORDER, token],
        { activeOrder: data.addPaymentToOrder },
        false
      );

      router.push(
        `/${intl.locale}/${
          pathnamesByLanguage.confirmation.languages[intl.locale]
        }?code=${order.code}`
      );
    } else {
      alert(intl.formatMessage(messages.invalidPaymentMethod));
      throw new Error(`Payment method ${values.paymentMethod} is invalid`);
    }
  },
})(InnerCheckoutForm);

export default CheckoutForm;
