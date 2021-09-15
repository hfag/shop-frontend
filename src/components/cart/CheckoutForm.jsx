import React from "react";
import { withFormik, Form, Field } from "formik";
import { Flex, Box } from "reflexbox";
import * as yup from "yup";
import PropTypes from "prop-types";
import { push } from "connected-react-router";
import { defineMessages, injectIntl, useIntl } from "react-intl";

import { clearShoppingCart } from "../../actions/shopping-cart";
import Button from "../../components/Button";
import RelativeBox from "../../components/RelativeBox";
import Link from "../../components/Link";
import SelectField from "../../components/SelectField";
import InputField from "../../components/InputField";
import InlinePage from "../../containers/InlinePage";
import { pathnamesByLanguage } from "../../utilities/urls";
import address from "../../i18n/address";
import order from "../../i18n/order";
import { trackOrder } from "../../utilities/analytics";
import { decodeHTMLEntities } from "../../utilities/text";

const messages = defineMessages({
  shipToDifferentAddress: {
    id: "CheckoutForm.shipToDifferentAddress",
    defaultMessage: "Lieferung an eine andere Adresse",
  },
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

/**
 * Gets an state option list by country key
 * @param {Object} countries The countries object
 * @param {string} country The country key
 * @returns {Array<Object>} The option list
 */
const getStateOptionsByCountry = (countries, country) => {
  return Object.keys(countries[country].states).map((value) => ({
    value,
    label: decodeHTMLEntities(countries[country].states[value]),
  }));
};

/**
 * The inner checkout form
 * @returns {Component} The inner checkout form
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
    showShipping,
    setShowShipping,
    countries,
  }) => {
    const intl = useIntl();
    return (
      <Form>
        <Flex flexWrap="wrap">
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
            <h3>Rechnungsdetails</h3>
            <InputField
              type="text"
              label={intl.formatMessage(address.additionalLineAbove)}
              name="billing_additional_line_above"
              required={false}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.firstName)}
              name="billing_first_name"
              required={true}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.lastName)}
              name="billing_last_name"
              required={true}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.description)}
              name="billing_description"
              required={false}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.company)}
              name="billing_company"
              required={false}
            />
            <SelectField
              label={intl.formatMessage(address.country)}
              name="billing_country"
              required={true}
              placeholder={intl.formatMessage(address.chooseCountry)}
              options={Object.keys(countries).map((key) => ({
                value: key,
                label: decodeHTMLEntities(countries[key].name),
              }))}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.street)}
              name="billing_address_1"
              required={true}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.postOfficeBox)}
              name="billing_post_office_box"
              required={false}
            />
            <InputField
              type="number"
              label={intl.formatMessage(address.postcode)}
              name="billing_postcode"
              required={true}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.city)}
              name="billing_city"
              required={true}
            />
            {values["billing_country"] &&
              countries[values["billing_country"]].states && (
                <SelectField
                  label={intl.formatMessage(address.state)}
                  name="billing_state"
                  required={true}
                  placeholder={intl.formatMessage(address.chooseState)}
                  options={getStateOptionsByCountry(
                    countries,
                    values["billing_country"]
                  )}
                />
              )}
            <InputField
              type="tel"
              label={intl.formatMessage(address.phone)}
              name="billing_phone"
              required={true}
            />
            <InputField
              type="email"
              label={intl.formatMessage(address.email)}
              name="billing_email"
              required={true}
            />
          </Box>
          <RelativeBox width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
            <InputField
              id="ship_to_different_address"
              name="ship_to_different_address"
              type="checkbox"
              value="1"
              onChange={(e) =>
                setShowShipping(e.currentTarget.checked ? true : false)
              }
              checkbox={true}
            />
            <h3>
              <label htmlFor="ship_to_different_address">
                {intl.formatMessage(messages.shipToDifferentAddress)}
              </label>
            </h3>
            {showShipping && (
              <div>
                <InputField
                  type="text"
                  label={intl.formatMessage(address.additionalLineAbove)}
                  name="shipping_additional_line_above"
                  required={false}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.firstName)}
                  name="shipping_first_name"
                  required={true}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.lastName)}
                  name="shipping_last_name"
                  required={true}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.description)}
                  name="shipping_description"
                  required={false}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.company)}
                  name="shipping_company"
                  required={false}
                />
                <SelectField
                  label={intl.formatMessage(address.country)}
                  name="shipping_country"
                  required={true}
                  placeholder={intl.formatMessage(address.chooseCountry)}
                  options={Object.keys(countries).map((key) => ({
                    value: key,
                    label: countries[key].name,
                  }))}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.street)}
                  name="shipping_address_1"
                  required={true}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.postOfficeBox)}
                  name="shipping_post_office_box"
                  required={false}
                />
                <InputField
                  type="number"
                  label={intl.formatMessage(address.postcode)}
                  name="shipping_postcode"
                  required={true}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.city)}
                  name="shipping_city"
                  required={true}
                />
                {values["shipping_country"] &&
                  countries[values["shipping_country"]].states && (
                    <SelectField
                      label={intl.formatMessage(address.state)}
                      name="shipping_state"
                      required={true}
                      placeholder={intl.formatMessage(address.chooseState)}
                      options={getStateOptionsByCountry(
                        countries,
                        values["shipping_country"]
                      )}
                    />
                  )}
              </div>
            )}
            <InputField
              label={intl.formatMessage(messages.orderComments)}
              name="order_comments"
              required={false}
              placeholder={intl.formatMessage(
                messages.orderCommentsPlaceholder
              )}
              component="textarea"
            />
          </RelativeBox>
        </Flex>
        <h3>{intl.formatMessage(messages.paymentMethods)}</h3>
        <Flex flexWrap="wrap">
          <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} pr={3}>
            <Field
              name="payment_method"
              type="radio"
              value="feuerschutz_invoice"
              checked={values.payment_method === "feuerschutz_invoice"}
            />{" "}
            {intl.formatMessage(order.invoice)}
          </Box>
        </Flex>
        <br />
        <InlinePage slug={pathnamesByLanguage[intl.locale].tos} />
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

const CheckoutForm = injectIntl(
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ values = {} }) => ({
      payment_method: "feuerschutz_invoice",
      ...values,
    }),
    validationSchema: ({ countries, intl }) => {
      const countryKeys = Object.keys(countries);

      return yup.object().shape({
        ship_to_different_address: yup.bool().default(false),

        billing_additional_line_above: yup.string(),
        shipping_additional_line_above: yup.string(),

        billing_first_name: yup.string().required(),
        shipping_first_name: yup.string().when("ship_to_different_address", {
          is: true,
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),

        billing_last_name: yup.string().required(),
        shipping_last_name: yup.string().when("ship_to_different_address", {
          is: true,
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),

        billing_description: yup.string(),
        shipping_description: yup.string(),

        billing_company: yup.string(),
        shipping_company: yup.string(),

        billing_country: yup.string().oneOf(countryKeys).required(),
        shipping_country: yup
          .string()
          .oneOf(countryKeys)
          .when("ship_to_different_address", {
            is: true,
            then: yup.string().oneOf(countryKeys).required(),
            otherwise: yup.string().oneOf(countryKeys).notRequired(),
          }),

        billing_address_1: yup.string().required(),
        shipping_address_1: yup.string().when("ship_to_different_address", {
          is: true,
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),

        billing_post_office_box: yup.string(),
        shipping_post_office_box: yup.string(),

        billing_postcode: yup.number().required(),
        shipping_postcode: yup.number().when("ship_to_different_address", {
          is: true,
          then: yup.number().required(),
          otherwise: yup.number().notRequired(),
        }),

        billing_city: yup.string().required(),
        shipping_city: yup.string().when("ship_to_different_address", {
          is: true,
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),

        billing_state: yup
          .string()
          .when("billing_country", (countryKey, schema) => {
            if (!countryKey) {
              return schema.notRequired();
            }

            const states = Object.keys(countries[countryKey].states);

            return states.length > 0
              ? schema.oneOf(states).required()
              : schema.notRequired();
          }),
        shipping_state: yup
          .string()
          .when(
            ["ship_to_different_address", "shipping_country"],
            (shipToDifferentAddress, countryKey, schema) => {
              if (!shipToDifferentAddress || !countryKey) {
                return schema.notRequired();
              }

              const states = Object.keys(countries[countryKey].states);

              return states.length > 0
                ? schema.oneOf(states).required()
                : schema.notRequired();
            }
          ),

        billing_phone: yup.string().required(),
        billing_email: yup.string().email().required(),

        terms: yup
          .mixed()
          .test(
            "is-checked",
            intl.formatMessage(messages.tosMustBeAccepted),
            (value) => value === true
          ),
      });
    },
    handleSubmit: (
      values,
      {
        props: { language, dispatch, submitOrder },
        setStatus,
        /* setErrors, setValues, setStatus, and other goodies */
      }
    ) => {
      const shippingAddress = {},
        billingAddress = {},
        comments = values["order_comments"],
        shipToDifferentAddress = values["ship_to_different_address"];

      Object.keys(values).forEach((key) => {
        if (key.startsWith("shipping_") && shipToDifferentAddress) {
          shippingAddress[key.replace("shipping_", "")] = values[key];
        } else if (key.startsWith("billing_")) {
          billingAddress[key.replace("billing_", "")] = values[key];
        }
      });

      setStatus("loading");
      submitOrder(shippingAddress, billingAddress, comments)
        .then(({ transactionId, total }) => {
          setStatus("success");
          setTimeout(() => {
            setStatus("");

            try {
              trackOrder(transactionId, total);
            } catch (e) {
              console.error(e);
            }

            dispatch(clearShoppingCart());
            dispatch(
              push(`/${language}/${pathnamesByLanguage[language].confirmation}`)
            );
          }, 300);
        })
        .catch((e) => {
          setStatus("error");
          setTimeout(() => setStatus(""), 300);
        });
    },
  })(InnerCheckoutForm)
);

CheckoutForm.propTypes = {
  language: PropTypes.string.isRequired,
  submitOrder: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  showShipping: PropTypes.bool.isRequired,
  setShowShipping: PropTypes.func.isRequired,
  countries: PropTypes.object.isRequired,
};

export default CheckoutForm;
