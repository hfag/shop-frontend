import React from "react";
import { withFormik, Form } from "formik";
import PropTypes from "prop-types";
import * as yup from "yup";
import styled from "styled-components";
import { useIntl } from "react-intl";

import Button from "../Button";
import InputField from "../InputField";
import SelectField from "../../components/SelectField";
import address from "../../i18n/address";
import form from "../../i18n/form";

const FormWrapper = styled(Form)`
  h2 {
    margin-top: 0;
  }
`;

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
 * The inner address form
 * @param {Object} params The formik params
 * @returns {Component} The component
 */
const InnerAddressForm = React.memo(
  ({ values, isValid, status = "", countries, type = "billing" }) => {
    const intl = useIntl();

    return (
      <FormWrapper>
        <h2>
          {type === "billing"
            ? intl.formatMessage(address.billingAddress)
            : intl.formatMessage(address.shippingAddress)}
        </h2>
        <InputField
          type="text"
          label={intl.formatMessage(address.additionalLineAbove)}
          name="additional_line_above"
          required={false}
        />
        <InputField
          type="text"
          label={intl.formatMessage(address.firstName)}
          name="first_name"
          required={true}
        />
        <InputField
          type="text"
          label={intl.formatMessage(address.lastName)}
          name="last_name"
          required={true}
        />
        <InputField
          type="text"
          label={intl.formatMessage(address.company)}
          name="company"
          required={false}
        />
        <SelectField
          label={intl.formatMessage(address.country)}
          name="country"
          required={true}
          placeholder={intl.formatMessage(address.chooseCountry)}
          options={Object.keys(countries).map(key => ({
            value: key,
            label: countries[key].name
          }))}
        />
        <InputField
          type="text"
          label={intl.formatMessage(address.street)}
          name="address_1"
          required={true}
        />
        <InputField
          type="text"
          label={intl.formatMessage(address.postOfficeBox)}
          name="post_office_box"
          required={false}
        />
        <InputField
          type="text"
          label={intl.formatMessage(address.postcode)}
          name="postcode"
          required={true}
        />
        <InputField
          type="text"
          label={intl.formatMessage(address.city)}
          name="city"
          required={true}
        />
        <SelectField
          label={intl.formatMessage(address.state)}
          name="state"
          required={
            values.country &&
            countries[values.country] &&
            countries[values.country].states
              ? true
              : undefined
          }
          placeholder={intl.formatMessage(address.chooseState)}
          options={
            values.country &&
            countries[values.country] &&
            countries[values.country].states
              ? getStateOptionsByCountry(countries, values["country"])
              : [
                  {
                    value: "AG",
                    label: intl.formatMessage(form.noInformation)
                  }
                ]
          }
        />
        {type === "billing" && (
          <div>
            <InputField
              type="tel"
              label={intl.formatMessage(address.phone)}
              name="phone"
              required={true}
            />
            <InputField
              type="email"
              label={intl.formatMessage(address.email)}
              name="email"
              required={true}
            />
          </div>
        )}
        <br />
        <Button fullWidth controlled state={isValid ? status : "disabled"}>
          {intl.formatMessage(form.saveChanges)}
        </Button>
      </FormWrapper>
    );
  }
);

const AddressForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({
    values: {
      additional_line_above,
      first_name,
      last_name,
      description,
      company,
      country,
      address_1,
      post_office_box,
      postcode,
      city,
      state,
      phone,
      email
    }
  }) => ({
    additional_line_above,
    first_name,
    last_name,
    description,
    company,
    country,
    address_1,
    post_office_box,
    postcode,
    city,
    state,
    phone,
    email
  }),
  validationSchema: ({ countries, type }) => {
    const states = [].concat.apply(
      [],
      Object.values(countries).map(country => Object.keys(country.states))
    );

    return yup.object().shape({
      additional_line_above: yup.string(),

      first_name: yup.string().required(),

      last_name: yup.string().required(),

      description: yup.string(),

      company: yup.string(),

      country: yup.string().oneOf(Object.keys(countries)).required(),

      address_1: yup.string().required(),

      post_office_box: yup.string(),

      postcode: yup.number().required(),

      city: yup.string().required(),

      state: yup.string().oneOf(states).required(),

      phone:
        type === "billing"
          ? yup.string().required()
          : yup.string().notRequired(),
      email:
        type === "billing"
          ? yup.string().email().required()
          : yup.string().notRequired()
    });
  },
  handleSubmit: (values, { props: { updateAddress, type }, setStatus }) => {
    setStatus("loading");
    updateAddress(values, type)
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          setStatus("");
        }, 300);
      })
      .catch(e => {
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
      });
  }
})(InnerAddressForm);

AddressForm.propTypes = {
  updateAddress: PropTypes.func.isRequired,
  countries: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired
};

export default AddressForm;
