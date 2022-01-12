import * as yup from "yup";
import { Field, Form, FormikProps, withFormik } from "formik";
import { IntlShape } from "react-intl";
import PropTypes from "prop-types";
import React from "react";
import styled from "@emotion/styled";

import {
  CREATE_CUSTOMER_ADDRESS,
  GET_CURRENT_CUSTOMER,
  UPDATE_CUSTOMER_ADDRESS,
} from "../../gql/user";
import { Country, Mutation } from "../../schema";
import { InputFieldWrapper } from "../form/InputFieldWrapper";
import { NextRouter } from "next/router";
import { mutate } from "swr";
import { pathnamesByLanguage } from "../../utilities/urls";
import Button from "../elements/Button";
import InputField from "../form/InputField";
import SelectField from "../form/SelectField";
import address from "../../i18n/address";
import form from "../../i18n/form";
import request from "../../utilities/request";

const FormWrapper = styled(Form)`
  h2 {
    margin-top: 0;
  }
`;

interface FormValues {
  fullName?: string;
  company?: string;
  streetLine1?: string;
  streetLine2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string; //country code
  phone?: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
}

interface IProps {
  id?: string;
  token: string | null;
  intl: IntlShape;
  router: NextRouter;
  countries: Country[];
  values: FormValues;
}

/**
 * The inner address form
 */
const InnerAddressForm = React.memo(
  ({
    intl,
    isValid,
    status = "",
    countries,
    values,
  }: IProps & FormikProps<FormValues>) => (
    <FormWrapper>
      {/*<InputField
    type="text"
    label={intl.formatMessage(address.additionalLineAbove)}
    name="additional_line_above"
    required={false}
  />*/}
      <InputField
        type="text"
        label={intl.formatMessage(address.fullName)}
        name="fullName"
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
        options={countries.map((country) => ({
          value: country.code,
          label: country.name,
        }))}
      />
      <InputField
        type="text"
        label={intl.formatMessage(address.street1)}
        name="streetLine1"
        required={true}
      />
      <InputField
        type="text"
        label={intl.formatMessage(address.street2)}
        name="streetLine2"
        required={false}
      />
      {/*<InputField
    type="text"
    label={intl.formatMessage(address.postOfficeBox)}
    name="post_office_box"
    required={false}
  />*/}
      <InputField
        type="text"
        label={intl.formatMessage(address.postalCode)}
        name="postalCode"
        required={true}
      />
      <InputField
        type="text"
        label={intl.formatMessage(address.city)}
        name="city"
        required={true}
      />
      <InputField
        type="text"
        label={intl.formatMessage(address.province)}
        name="province"
        required={true}
      />
      <InputField
        type="text"
        label={intl.formatMessage(address.phone)}
        name="phone"
        required={false}
      />
      <InputFieldWrapper>
        <Field
          type="checkbox"
          id="defaultShippingAddress"
          name="defaultShippingAddress"
        />
        <label htmlFor="defaultShippingAddress">
          {intl.formatMessage(address.defaultShippingAddress)}
        </label>
      </InputFieldWrapper>
      <InputFieldWrapper>
        <Field
          type="checkbox"
          id="defaultBillingAddress"
          name="defaultBillingAddress"
        />
        <label htmlFor="defaultBillingAddress">
          {intl.formatMessage(address.defaultBillingAddress)}
        </label>
      </InputFieldWrapper>
      <br />
      <Button fullWidth controlled state={isValid ? status : "disabled"}>
        {intl.formatMessage(form.saveChanges)}
      </Button>
    </FormWrapper>
  )
);

const AddressForm = withFormik<IProps, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: ({ values }) => ({
    ...values,
  }),
  validationSchema: ({ countries, type }) => {
    return yup.object().shape({
      // additional_line_above: yup.string(),

      fullName: yup.string().required(),

      // description: yup.string(),

      company: yup.string(),

      country: yup
        .string()
        .oneOf(countries.map((c) => c.code))
        .required(),

      streetLine1: yup.string().required(),

      streetLine2: yup.string().notRequired(),

      // post_office_box: yup.string(),

      postalCode: yup.number().required(),

      city: yup.string().required(),

      province: yup.string().required(),

      phone: yup.string().notRequired(),

      defaultShippingAddress: yup.boolean(),
      defaultBillingAddress: yup.boolean(),
    });
  },
  handleSubmit: async (
    values,
    { props: { intl, router, id = "new", token }, setStatus }
  ) => {
    setStatus("loading");

    try {
      if (id === "new") {
        await request<{
          createCustomerAddress: Mutation["createCustomerAddress"];
        }>(intl.locale, CREATE_CUSTOMER_ADDRESS, {
          input: {
            fullName: values.fullName,
            company: values.company,
            streetLine1: values.streetLine1,
            streetLine2: values.streetLine2,
            city: values.city,
            province: values.province,
            postalCode: values.postalCode,
            countryCode: values.country,
            phoneNumber: values.phone,
            defaultShippingAddress: values.defaultShippingAddress,
            defaultBillingAddress: values.defaultBillingAddress,
          },
        });
      } else {
        await request<{
          updateCustomerAddress: Mutation["updateCustomerAddress"];
        }>(intl.locale, UPDATE_CUSTOMER_ADDRESS, {
          input: {
            id,
            fullName: values.fullName,
            company: values.company,
            streetLine1: values.streetLine1,
            streetLine2: values.streetLine2,
            city: values.city,
            province: values.province,
            postalCode: values.postalCode,
            countryCode: values.country,
            phoneNumber: values.phone,
            defaultShippingAddress: values.defaultShippingAddress,
            defaultBillingAddress: values.defaultBillingAddress,
          },
        });
      }

      mutate([GET_CURRENT_CUSTOMER, token]);

      setStatus("success");
      setTimeout(() => {
        setStatus("");
        router.push(
          `/${intl.locale}/${
            pathnamesByLanguage.account.languages[intl.locale]
          }/${
            pathnamesByLanguage.account.pathnames.address.languages[intl.locale]
          }`
        );
      }, 300);
    } catch (e) {
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
    }
  },
})(InnerAddressForm);

export default AddressForm;
