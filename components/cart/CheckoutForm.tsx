import React, { FunctionComponent } from "react";
import { withFormik, Form, Field, FormikProps } from "formik";
import { Flex, Box } from "reflexbox";
import * as yup from "yup";
import { defineMessages, useIntl, injectIntl, IntlShape } from "react-intl";

import Button from "../elements/Button";
import InputField from "../form/InputField";
import order from "../../i18n/order";
import {
  CurrentUser,
  ShippingMethodQuote,
  CreateAddressInput,
} from "../../schema";
import request from "../../utilities/request";
import {
  GET_ACTIVE_ORDER,
  ORDER_SET_CUSTOMER,
  ORDER_SET_SHIPPING_METHOD,
  ORDER_SET_SHIPPING_ADDRESS,
  ORDER_GET_SHIPPING_METHODS,
  ORDER_ADD_PAYMENT,
} from "../../gql/order";
import useSWR, { mutate } from "swr";
import Placeholder from "../elements/Placeholder";
import Price from "../elements/Price";

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
});

interface FormValues {
  shippingMethod?: string;
  orderComments?: string;
  terms?: boolean;
  paymentMethod: string;
}

interface IProps {
  intl: IntlShape;
  token?: string;
  account: CurrentUser | null;
  values?: FormValues;
  billingAddress: CreateAddressInput | null;
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
  }: IProps & FormikProps<FormValues>) => {
    const {
      data,
    }: {
      data?: { eligibleShippingMethods: ShippingMethodQuote[] };
      error?: any;
    } = useSWR(ORDER_GET_SHIPPING_METHODS, (query) =>
      request(intl.locale, query)
    );

    return (
      <Form>
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
                <Field
                  name="shippingMethod"
                  type="radio"
                  value={shippingMethod.id}
                  checked={values.shippingMethod === shippingMethod.id}
                />{" "}
                {shippingMethod.description}{" "}
                <Price>{shippingMethod.price}</Price>
              </Box>
            ))
          ) : (
            <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} pr={3}>
              <Placeholder block />
            </Box>
          )}
        </Flex>
        <Flex flexWrap="wrap">
          <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} pr={3}>
            <Field
              name="paymentMethod"
              type="radio"
              value="invoice"
              checked={values.paymentMethod === "invoice"}
            />{" "}
            {intl.formatMessage(order.invoice)}
          </Box>
        </Flex>
        <br />
        {/*<InlinePage slug={pathnamesByLanguage.tos.languages[intl.locale]} />*/}
        <InputField id="terms" name="terms" type="checkbox" value="1">
          <label htmlFor="terms">
            {intl.formatMessage(messages.acceptTos)}
          </label>
        </InputField>
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
    { props: { intl, token, billingAddress }, setStatus }
  ) => {
    await request(intl.locale, ORDER_SET_SHIPPING_METHOD, {
      shippingMethodId: values.shippingMethod,
    });

    const data = await request(intl.locale, ORDER_ADD_PAYMENT, {
      input: { method: values.paymentMethod, metadata: { billingAddress } },
    });

    mutate([GET_ACTIVE_ORDER, token], data.addPaymentToOrder, false);
  },
})(InnerCheckoutForm);

export default CheckoutForm;
