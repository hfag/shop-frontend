import React from "react";
import { withFormik, Form, Field } from "formik";
import { Flex, Box } from "grid-styled";
import * as yup from "yup";
import MaskedInput from "react-text-mask";
import PropTypes from "prop-types";
import { push } from "react-router-redux";

import { trackConversion } from "../../actions/orders";
import { clearShoppingCart } from "../../actions/shopping-cart";
import Button from "../../components/Button";
import RelativeBox from "../../components/RelativeBox";
import Link from "../../components/Link";
import SelectField from "../../components/SelectField";
import InputField from "../../components/InputField";
import InlinePage from "../../containers/InlinePage";

/**
 * Gets an state option list by country key
 * @param {Object} countries The countries object
 * @param {string} country The country key
 * @returns {Array<Object>} The option list
 */
const getStateOptionsByCountry = (countries, country) => {
  return Object.keys(countries[country].states).map(value => ({
    value,
    label: countries[country].states[value]
  }));
};

/**
 * The inner checkout form
 * @returns {Component} The inner checkout form
 */
const InnerCheckoutForm = ({
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
  countries
}) => (
  <Form>
    <Flex flexWrap="wrap">
      <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
        <h3>Rechnungsdetails</h3>
        <InputField
          type="text"
          label="Zusatzzeile oben"
          name="billing_additional_line_above"
          required={false}
        />
        <InputField
          type="text"
          label="Vorname"
          name="billing_first_name"
          required={true}
        />
        <InputField
          type="text"
          label="Nachname"
          name="billing_last_name"
          required={true}
        />
        <InputField
          type="text"
          label="Bezeichnung"
          name="billing_description"
          required={false}
        />
        <InputField
          type="text"
          label="Firmenname"
          name="billing_company"
          required={false}
        />
        <SelectField
          label="Land"
          name="billing_country"
          required={true}
          placeholder="Wählen Sie ein Land"
          options={Object.keys(countries).map(key => ({
            value: key,
            label: countries[key].name
          }))}
        />
        <InputField
          type="text"
          label="Strasse"
          name="billing_address_1"
          required={true}
        />
        <InputField
          type="text"
          label="Postfach"
          name="billing_post_office_box"
          required={false}
        />
        <InputField
          type="number"
          label="Postleitzahl"
          name="billing_postcode"
          required={true}
        />
        <InputField
          type="text"
          label="Ort / Stadt"
          name="billing_city"
          required={true}
        />
        {values["billing_country"] &&
          countries[values["billing_country"]].states && (
            <SelectField
              label="Kanton"
              name="billing_state"
              required={true}
              placeholder="Wählen Sie einen Kanton"
              options={getStateOptionsByCountry(
                countries,
                values["billing_country"]
              )}
            />
          )}
        <InputField
          type="tel"
          label="Telefon"
          name="billing_phone"
          required={true}
        />
        <InputField
          type="email"
          label="E-Mail Adresse"
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
          onChange={e =>
            setShowShipping(e.currentTarget.checked ? true : false)
          }
          checkbox={true}
        />
        <h3>
          <label htmlFor="ship_to_different_address">
            Lieferung an eine andere Adresse
          </label>
        </h3>
        {showShipping && (
          <div>
            <InputField
              type="text"
              label="Zusatzzeile oben"
              name="shipping_additional_line_above"
              required={false}
            />
            <InputField
              type="text"
              label="Vorname"
              name="shipping_first_name"
              required={true}
            />
            <InputField
              type="text"
              label="Nachname"
              name="shipping_last_name"
              required={true}
            />
            <InputField
              type="text"
              label="Bezeichnung"
              name="shipping_description"
              required={false}
            />
            <InputField
              type="text"
              label="Firmenname"
              name="shipping_company"
              required={false}
            />
            <SelectField
              label="Land"
              name="shipping_country"
              required={true}
              placeholder="Wählen Sie ein Land"
              options={Object.keys(countries).map(key => ({
                value: key,
                label: countries[key].name
              }))}
            />
            <InputField
              type="text"
              label="Strasse"
              name="shipping_address_1"
              required={true}
            />
            <InputField
              type="text"
              label="Postfach"
              name="shipping_post_office_box"
              required={false}
            />
            <InputField
              type="number"
              label="Postleitzahl"
              name="shipping_postcode"
              required={true}
            />
            <InputField
              type="text"
              label="Ort / Stadt"
              name="shipping_city"
              required={true}
            />
            {values["shipping_country"] &&
              countries[values["shipping_country"]].states && (
                <SelectField
                  label="Kanton"
                  name="shipping_state"
                  required={true}
                  placeholder="Wählen Sie einen Kanton"
                  options={getStateOptionsByCountry(
                    countries,
                    values["shipping_country"]
                  )}
                />
              )}
          </div>
        )}
        <InputField
          label="Bestellnotiz"
          name="order_comments"
          required={false}
          placeholder="Anmerkungen zu Ihrer Bestellung, z.B. besondere Hinweise für die Lieferung."
          component="textarea"
        />
      </RelativeBox>
    </Flex>
    <h3>Zahlungsmethoden</h3>
    <Flex flexWrap="wrap">
      <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} pr={3}>
        <Field
          name="payment_method"
          type="radio"
          value="feuerschutz_invoice"
          checked={values.payment_method === "feuerschutz_invoice"}
        />{" "}
        Rechnung
      </Box>
    </Flex>
    <br />
    <InlinePage slug="agbs" />
    <InputField id="terms" name="terms" type="checkbox" value="1">
      <label htmlFor="terms">
        Ich habe die Allgemeinen Geschäftsbedingungen gelesen und akzeptiere
        diese *
      </label>
    </InputField>
    <Button
      fullWidth
      onClick={handleSubmit}
      controlled
      state={isValid ? status : "disabled"}
    >
      Bestellung abschicken
    </Button>
  </Form>
);

const CheckoutForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ values = {} }) => ({
    payment_method: "feuerschutz_invoice",
    ...values
  }),
  validationSchema: ({ countries }) => {
    const states = [].concat.apply(
      [],
      Object.values(countries).map(country =>
        country.states ? Object.keys(country.states) : []
      )
    );

    return yup.object().shape({
      ship_to_different_address: yup.bool().default(false),

      billing_additional_line_above: yup.string(),
      shipping_additional_line_above: yup.string(),

      billing_first_name: yup.string().required(),
      shipping_first_name: yup.string().when("ship_to_different_address", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired()
      }),

      billing_last_name: yup.string().required(),
      shipping_last_name: yup.string().when("ship_to_different_address", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired()
      }),

      billing_description: yup.string(),
      shipping_description: yup.string(),

      billing_company: yup.string(),
      shipping_company: yup.string(),

      billing_country: yup
        .string()
        .oneOf(Object.keys(countries))
        .required(),
      shipping_country: yup
        .string()
        .oneOf(Object.keys(countries))
        .when("ship_to_different_address", {
          is: true,
          then: yup
            .string()
            .oneOf(Object.keys(countries))
            .required(),
          otherwise: yup
            .string()
            .oneOf(Object.keys(countries))
            .notRequired()
        }),

      billing_address_1: yup.string().required(),
      shipping_address_1: yup.string().when("ship_to_different_address", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired()
      }),

      billing_post_office_box: yup.string(),
      shipping_post_office_box: yup.string(),

      billing_postcode: yup.number().required(),
      shipping_postcode: yup.number().when("ship_to_different_address", {
        is: true,
        then: yup.number().required(),
        otherwise: yup.number().notRequired()
      }),

      billing_city: yup.string().required(),
      shipping_city: yup.string().when("ship_to_different_address", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired()
      }),

      billing_state: yup
        .string()
        /*.oneOf(states)*/
        .notRequired(),
      shipping_state: yup.string().when("ship_to_different_address", {
        is: true,
        then: yup
          .string()
          /*.oneOf(states)*/
          .notRequired(),
        otherwise: yup
          .string()
          /*.oneOf(states)*/
          .notRequired()
      }),

      billing_phone: yup.string().required(),
      billing_email: yup
        .string()
        .email()
        .required(),

      terms: yup
        .mixed()
        .test(
          "is-checked",
          "Die AGBs müssen akzeptiert werden!",
          value => value === true
        )
    });
  },
  handleSubmit: (
    values,
    {
      props: { dispatch, submitOrder },
      setStatus
      /* setErrors, setValues, setStatus, and other goodies */
    }
  ) => {
    const shippingAddress = {},
      billingAddress = {},
      comments = values["order_comments"],
      shipToDifferentAddress = values["ship_to_different_address"];

    Object.keys(values).forEach(key => {
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

          dispatch(trackConversion(total || 0, "CHF", transactionId || "-1"));

          dispatch(clearShoppingCart());
          dispatch(push("/bestaetigung"));
        }, 300);
      })
      .catch(e => {
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
      });
  }
})(InnerCheckoutForm);

CheckoutForm.propTypes = {
  submitOrder: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  showShipping: PropTypes.bool.isRequired,
  setShowShipping: PropTypes.func.isRequired,
  countries: PropTypes.object.isRequired
};

export default CheckoutForm;
