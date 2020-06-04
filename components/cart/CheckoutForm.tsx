import React, { FunctionComponent, useMemo } from "react";
import { withFormik, Form, Field, FormikProps } from "formik";
import { Flex, Box } from "reflexbox";
import * as yup from "yup";
import { defineMessages, useIntl, injectIntl, IntlShape } from "react-intl";

import Button from "../elements/Button";
import InputField from "../form/InputField";
import {
  CurrentUser,
  ShippingMethodQuote,
  CreateAddressInput,
  Order,
} from "../../schema";
import request from "../../utilities/request";
import {
  GET_ACTIVE_ORDER,
  ORDER_SET_CUSTOMER,
  ORDER_SET_SHIPPING_METHOD,
  ORDER_SET_SHIPPING_ADDRESS,
  ORDER_GET_SHIPPING_METHODS,
  TRANSITION_ORDER_AND_ADD_PAYMENT,
  ORDER_ADD_PAYMENT,
} from "../../gql/order";
import useSWR, { mutate } from "swr";
import Placeholder from "../elements/Placeholder";
import Price from "../elements/Price";
import Table from "../elements/Table";
import product from "../../i18n/product";
import orderMessages from "../../i18n/order";
import { NextRouter } from "next/router";
import { pathnamesByLanguage } from "../../utilities/urls";

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
});

interface FormValues {
  shippingMethod?: string;
  orderComments?: string;
  terms?: boolean;
  paymentMethod: string;
}

interface IProps {
  intl: IntlShape;
  router: NextRouter;
  token?: string;
  account: CurrentUser | null;
  values?: FormValues;
  billingAddress: CreateAddressInput | null;
  order: Order | null;
}

/**
 * The inner checkout form
 */
const InnerCheckoutForm = React.memo(
  ({
    status,
    values,
    isValid,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    intl,
    order,
  }: IProps & FormikProps<FormValues>) => {
    const {
      data,
    }: {
      data?: { eligibleShippingMethods: ShippingMethodQuote[] };
      error?: any;
    } = useSWR(ORDER_GET_SHIPPING_METHODS, (query) =>
      request(intl.locale, query)
    );

    const shipping: number | null = useMemo(() => {
      if (!data) {
        return null;
      }

      const method = data.eligibleShippingMethods.find(
        (m) => m.id === values.shippingMethod
      );

      return method ? method.priceWithTax : null;
    }, [data, values]);

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
            data.eligibleShippingMethods.map((shippingMethod) => (
              <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} pr={3}>
                <label>
                  <Field
                    name="shippingMethod"
                    type="radio"
                    value={shippingMethod.id}
                    checked={values.shippingMethod === shippingMethod.id}
                  />{" "}
                  {shippingMethod.description}{" "}
                  <Price>{shippingMethod.price}</Price>
                </label>
              </Box>
            ))
          ) : (
            <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} pr={3}>
              <Placeholder block />
            </Box>
          )}
        </Flex>
        <h3>{intl.formatMessage(messages.paymentMethods)}</h3>
        <Flex flexWrap="wrap">
          <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} pr={3}>
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
        {/*<InlinePage slug={pathnamesByLanguage.tos.languages[intl.locale]} />*/}
        <InputField id="terms" name="terms" type="checkbox" value="1">
          <label htmlFor="terms">
            {intl.formatMessage(messages.acceptTos)}
          </label>
        </InputField>
        <br />
        <Table>
          <thead>
            <th></th>
            <th>Subtotal</th>
          </thead>
          <tbody>
            <tr>
              <td>{intl.formatMessage(product.subtotal)}</td>
              <td>
                <Price>{order.subTotalBeforeTax}</Price>
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(orderMessages.taxes)}</td>
              <td>
                <Price>{order.total - order.subTotalBeforeTax}</Price>
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(orderMessages.shipping)}</td>
              <td>{shipping && <Price>{shipping}</Price>}</td>
            </tr>
            <tr>
              <td>{intl.formatMessage(orderMessages.total)}</td>
              <td>
                <Price>
                  {shipping ? order.total + shipping : order.totalBeforeTax}
                </Price>
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
  mapPropsToValues: ({ values = {} }) => ({
    paymentMethod: "invoice",
    ...values,
  }),

  validationSchema: ({ intl }: { intl: IntlShape }) => {
    return yup.object().shape({
      shippingMethod: yup.string().required(),
      paymentMethod: yup.string().required(),
      terms: yup
        .mixed()
        .test(
          "is-checked",
          intl.formatMessage(messages.tosMustBeAccepted),
          (value) => value === true
        ),
    });
  },
  handleSubmit: async (
    values,
    { props: { intl, token, billingAddress, order, router }, setStatus }
  ) => {
    if (!order) {
      return;
    }
    if (values.paymentMethod === "invoice") {
      let data;

      if (order.state === "ArrangingPayment") {
        data = await request(intl.locale, ORDER_ADD_PAYMENT, {
          input: { method: values.paymentMethod, metadata: { billingAddress } },
        });
      } else {
        await request(intl.locale, ORDER_SET_SHIPPING_METHOD, {
          shippingMethodId: values.shippingMethod,
        });

        data = await request(intl.locale, TRANSITION_ORDER_AND_ADD_PAYMENT, {
          input: {
            method: values.paymentMethod,
            metadata: { billingAddress },
          },
        });
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
