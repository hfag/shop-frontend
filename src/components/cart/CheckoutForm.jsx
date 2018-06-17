import React from "react";
import styled from "styled-components";
import { withFormik, Form, Field } from "formik";
import { Flex, Box } from "grid-styled";
import * as yup from "yup";
import get from "lodash/get";

import { colors } from "../../utilities/style";
import Button from "../../components/Button";
import RelativeBox from "../../components/RelativeBox";
import Link from "../../components/Link";
import SelectField from "../../components/SelectField";

const COUNTRIES = [
  { label: "Schweiz", value: "ch" },
  { label: "Liechtenstein", value: "li" }
];

const STATES = [
  { label: "Aargau", value: "AG" },
  { label: "Appenzell Ausserrhoden", value: "AR" },
  { label: "Appenzell Innerrhoden", value: "IR" },
  { label: "Basel-Landschaft", value: "BL" },
  { label: "Basel-Stadt", value: "BS" },
  { label: "Bern", value: "BE" },
  { label: "Freiburg", value: "FR" },
  { label: "Genf", value: "GE" },
  { label: "Glarus", value: "GL" },
  { label: "Graubünden", value: "GR" },
  { label: "Jura", value: "JU" },
  { label: "Luzern", value: "LU" },
  { label: "Neuenburg", value: "NE" },
  { label: "Nidwalden", value: "NW" },
  { label: "Obwalden", value: "OW" },
  { label: "Schaffhausen", value: "SH" },
  { label: "Schwyz", value: "SZ" },
  { label: "Solothurn", value: "SO" },
  { label: "St. Gallen", value: "SG" },
  { label: "Tessin", value: "TI" },
  { label: "Thurgau", value: "TG" },
  { label: "Uri", value: "UR" },
  { label: "Waadt", value: "VD" },
  { label: "Wallis", value: "VS" },
  { label: "Zug", value: "ZG" },
  { label: "Zürich", value: "ZH" }
];

const CheckoutFieldWrapper = styled.div`
  margin-bottom: 0.25rem;

  ${({ checkbox }) =>
    checkbox
      ? `position: absolute;
  top: 1.3rem;
  left: -1.5rem;
  right: 0;
  `
      : ""} /**/    
  .checkout-label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input[type="text"],
  input[type="search"],
  input[type="number"],
  input[type="email"],
  input[type="tel"],
  textarea {
    width: 100%;
    padding: 0.25rem 0.5rem;
  }

  input[type="checkbox"],
  input[type="radio"] {
    margin: 0.25rem 0.5rem 0.25rem 0;
  }
`;

const ValidationErrors = styled.div`
  color: ${colors.danger};
`;

/**
 * The checkout field component, rendering a label and input field
 * @returns {UnstyledCheckoutField} The checkout field
 */
class CheckoutField extends React.Component {
  render = () => {
    const {
      label,
      name,
      required = false,
      placeholder,
      type,
      value: forceValue,
      onChange: secondOnChange,
      checkbox,
      component,
      children
    } = this.props;
    const Component = component ? component : "input";

    return (
      <CheckoutFieldWrapper checkbox={checkbox}>
        {label && 
          <label className="checkout-label" htmlFor={name}>
            {label} {required ? "*" : "(optional)"}
          </label>
        }
        <Field
          name={name}
          render={({
            field: { value, onChange, onBlur },
            form: { values, errors, touched, validateForm }
          }) => 
            <div>
              <Component
                name={name}
                value={forceValue || value || ""}
                onChange={
                  secondOnChange
                    ? e => {
                        secondOnChange(e);
                        return onChange(e);
                      }
                    : onChange
                }
                onBlur={onBlur}
                placeholder={placeholder}
                type={type}
              />
              {children}
              {get(touched, name) && 
                <ValidationErrors>{get(errors, name)}</ValidationErrors>
              }
            </div>
          }
        />
      </CheckoutFieldWrapper>
    );
  };
}

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
  setShowShipping
}) => 
  <Form>
    <Flex>
      <Box width={[1, 1, 1 / 2, 1 / 2]} mr={3}>
        <h3>Rechnungsdetails</h3>
        <CheckoutField
          type="text"
          label="Zusatzzeile oben"
          name="billing_additional_line_above"
          required={false}
        />
        <CheckoutField
          type="text"
          label="Vorname"
          name="billing_first_name"
          required={true}
        />
        <CheckoutField
          type="text"
          label="Nachname"
          name="billing_last_name"
          required={true}
        />
        <CheckoutField
          type="text"
          label="Bezeichnung"
          name="billing_description"
          required={false}
        />
        <CheckoutField
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
          options={COUNTRIES}
        />
        <CheckoutField
          type="text"
          label="Strasse"
          name="billing_address_1"
          required={true}
        />
        <CheckoutField
          type="text"
          label="Postfach"
          name="billing_post_office"
          required={false}
        />
        <CheckoutField
          type="number"
          label="Postleitzahl"
          name="billing_postcode"
          required={true}
        />
        <CheckoutField
          type="text"
          label="Ort / Stadt"
          name="billing_city"
          required={true}
        />
        <SelectField
          label="Kanton"
          name="billing_state"
          required={true}
          placeholder="Wählen Sie einen Kanton"
          options={STATES}
        />
        <CheckoutField
          type="tel"
          label="Telefon"
          name="billing_phone"
          required={true}
        />
        <CheckoutField
          type="email"
          label="E-Mail Adresse"
          name="billing_email"
          required={true}
        />
      </Box>
      <RelativeBox width={[1, 1, 1 / 2, 1 / 2]} ml={3}>
        <CheckoutField
          name="ship_to_different_address"
          type="checkbox"
          value="1"
          onChange={e =>
            setShowShipping(e.currentTarget.checked ? true : false)
          }
          checkbox={true}
        />
        <h3>Lieferung an eine andere Adresse</h3>
        {showShipping && 
          <div>
            <CheckoutField
              type="text"
              label="Zusatzzeile oben"
              name="shipping_additional_line_above"
              required={false}
            />
            <CheckoutField
              type="text"
              label="Vorname"
              name="shipping_first_name"
              required={true}
            />
            <CheckoutField
              type="text"
              label="Nachname"
              name="shipping_last_name"
              required={true}
            />
            <CheckoutField
              type="text"
              label="Bezeichnung"
              name="shipping_description"
              required={false}
            />
            <CheckoutField
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
              options={COUNTRIES}
            />
            <CheckoutField
              type="text"
              label="Strasse"
              name="shipping_address_1"
              required={true}
            />
            <CheckoutField
              type="text"
              label="Postfach"
              name="shipping_post_office"
              required={false}
            />
            <CheckoutField
              type="number"
              label="Postleitzahl"
              name="shipping_postcode"
              required={true}
            />
            <CheckoutField
              type="text"
              label="Ort / Stadt"
              name="shipping_city"
              required={true}
            />
            <SelectField
              label="Kanton"
              name="shipping_state"
              required={true}
              placeholder="Wählen Sie einen Kanton"
              options={STATES}
            />
          </div>
        }
        <CheckoutField
          label="Bestellnotiz"
          name="order_comments"
          required={false}
          placeholder="Anmerkungen zu Ihrer Bestellung, z.B. besondere Hinweise für die Lieferung."
          component="textarea"
        />
      </RelativeBox>
    </Flex>
    <h3>Zahlungsmethoden</h3>
    <Flex>
      <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} mr={3}>
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
    <CheckoutField id="terms" name="terms" type="checkbox" value="1">
      <label htmlFor="terms">
        Ich habe die{" "}
        <Link to="/" styled>
          Allgemeinen Geschäftsbedingungen
        </Link>{" "}
        gelesen und akzeptiere diese *
      </label>
    </CheckoutField>
    <Button
      fullWidth
      onClick={handleSubmit}
      controlled
      state={isValid ? "" : "disabled"}
    >
      Bestellung abschicken
    </Button>
  </Form>
;

const CheckoutForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({ payment_method: "feuerschutz_invoice" }),
  validationSchema: yup.object().shape({
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
      .oneOf(COUNTRIES.map(country => country.value))
      .required(),
    shipping_country: yup
      .string()
      .oneOf(COUNTRIES.map(country => country.value))
      .when("ship_to_different_address", {
        is: true,
        then: yup
          .string()
          .oneOf(COUNTRIES.map(country => country.value))
          .required(),
        otherwise: yup
          .string()
          .oneOf(COUNTRIES.map(country => country.value))
          .notRequired()
      }),

    billing_address_1: yup.string().required(),
    shipping_address_1: yup.string().when("ship_to_different_address", {
      is: true,
      then: yup.string().required(),
      otherwise: yup.string().notRequired()
    }),

    billing_post_office: yup.string(),
    shipping_post_office: yup.string(),

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
      .oneOf(STATES.map(state => state.value))
      .required(),
    shipping_state: yup
      .string()
      .oneOf(STATES.map(state => state.value))
      .when("ship_to_different_address", {
        is: true,
        then: yup
          .string()
          .oneOf(STATES.map(state => state.value))
          .required(),
        otherwise: yup
          .string()
          .oneOf(STATES.map(state => state.value))
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
  }),
  handleSubmit: (
    values,
    {
      props: { items, submitOrder },
      setStatus,
      setErrors /* setValues, setStatus, and other goodies */
    }
  ) => {
    setStatus("loading");
    submitOrder(items)
      .then(() => {
        setStatus("success");
        setTimeout(() => setStatus(""), 300);
      })
      .catch(e => {
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
      });
  }
})(InnerCheckoutForm);

export default CheckoutForm;
