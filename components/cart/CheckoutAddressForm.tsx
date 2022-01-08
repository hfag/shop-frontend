import * as yup from "yup";
import { Form, FormikProps, withFormik } from "formik";
import { IntlShape, defineMessages } from "react-intl";
import React, { FunctionComponent } from "react";

import {
  Address,
  Country,
  CreateAddressInput,
  CurrentUser,
  Customer,
  Mutation,
  OrderAddress,
} from "../../schema";
import {
  GET_ACTIVE_ORDER,
  ORDER_SET_ADDRESS,
  ORDER_SET_CUSTOMER,
} from "../../gql/order";
import { errorCodeToMessage } from "../../utilities/i18n";
import { mutate } from "swr";
import Box from "../layout/Box";
import Button from "../elements/Button";
import Flex from "../layout/Flex";
import InputField from "../form/InputField";
import SelectField from "../form/SelectField";
import address from "../../i18n/address";
import request from "../../utilities/request";

const messages = defineMessages({
  shipToDifferentAddress: {
    id: "CheckoutAddressForm.shipToDifferentAddress",
    defaultMessage: "Lieferung an eine andere Adresse",
  },
  continue: {
    id: "CheckoutAddressForm.continue",
    defaultMessage: "Weiter",
  },
  errorPhoneNumber: {
    id: "CheckoutForm.errorPhoneNumber",
    defaultMessage:
      "Bitte die Telefonnummer im Format '000 000 00 00' eingegeben.",
  },
});

interface FormValues {
  billingFirstName?: string;
  billingLastName?: string;
  billingCompany?: string;
  billingStreetLine1?: string;
  billingStreetLine2?: string;
  billingCity?: string;
  billingProvince?: string;
  billingPostalCode?: string;
  billingCountry?: string; //country code
  billingPhone?: string;
  billingEmail?: string;

  shippingFullName?: string;
  shippingCompany?: string;
  shippingStreetLine1?: string;
  shippingStreetLine2?: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  shippingCountry?: string; //country code
  shippingPhoneNumber?: string;

  shipToDifferentAddress?: boolean;
}

interface IProps {
  countries: Country[];
  token?: string;
  billingAddress: Address | OrderAddress | null;
  shippingAddress: Address | OrderAddress | null;
  customer: Customer | null;
  intl: IntlShape;
  enabled?: boolean;
  onProceed?: () => void;
}

/**
 * The inner checkout form
 */
const InnerCheckoutAddressForm = React.memo(
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
    countries,
    intl,
    enabled,
    billingAddress,
    shippingAddress,
  }: IProps & FormikProps<FormValues>) => {
    const readOnly = !enabled;

    return (
      <Form>
        <Flex flexWrap="wrap">
          <Box widths={[1, 1, 1, 1 / 2, 1 / 2]} paddingRight={1}>
            <h3>Rechnungsdetails</h3>
            {/*<InputField
                type="text"
                label={intl.formatMessage(address.additionalLineAbove)}
                name="billing_additional_line_above"
                required={false}
              />*/}
            <InputField
              type="text"
              label={intl.formatMessage(address.firstName)}
              name="billingFirstName"
              required={true}
              readOnly={readOnly}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.lastName)}
              name="billingLastName"
              required={true}
              readOnly={readOnly}
            />
            {/*<InputField
                type="text"
                label={intl.formatMessage(address.description)}
                name="billing_description"
                required={false}
                readOnly={readOnly}
              />*/}
            <InputField
              type="text"
              label={intl.formatMessage(address.company)}
              name="billingCompany"
              required={false}
              readOnly={readOnly}
            />
            <SelectField
              label={intl.formatMessage(address.country)}
              name="billingCountry"
              required={true}
              placeholder={intl.formatMessage(address.chooseCountry)}
              options={countries.map((country) => ({
                value: country.code,
                label: country.name,
              }))}
              readOnly={readOnly}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.street1)}
              name="billingStreetLine1"
              required={true}
              readOnly={readOnly}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.street2)}
              name="billingStreetLine2"
              required={false}
              readOnly={readOnly}
            />
            {/*<InputField
                type="text"
                label={intl.formatMessage(address.postOfficeBox)}
                name="billing_post_office_box"
                required={false}
              />*/}
            <InputField
              type="text"
              label={intl.formatMessage(address.postalCode)}
              name="billingPostalCode"
              required={true}
              readOnly={readOnly}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.city)}
              name="billingCity"
              required={true}
              readOnly={readOnly}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.province)}
              name="billingProvince"
              required={true}
              readOnly={readOnly}
            />
            <InputField
              type="text"
              label={intl.formatMessage(address.phone)}
              name="billingPhone"
              required={true}
              readOnly={readOnly}
            />
            <InputField
              type="email"
              label={intl.formatMessage(address.email)}
              name="billingEmail"
              required={true}
              readOnly={readOnly}
            />
          </Box>
          <Box widths={[1, 1, 1, 1 / 2, 1 / 2]} paddingRight={1}>
            <InputField
              id="shipToDifferentAddress"
              name="shipToDifferentAddress"
              type="checkbox"
              value="1"
              checkbox={true}
              componentProps={{ checked: values.shipToDifferentAddress }}
              readOnly={readOnly}
            />
            <h3>
              <label htmlFor="shipToDifferentAddress">
                {intl.formatMessage(messages.shipToDifferentAddress)}
              </label>
            </h3>
            {values.shipToDifferentAddress && (
              <div>
                {/*<InputField
                type="text"
                label={intl.formatMessage(address.additionalLineAbove)}
                name="billing_additional_line_above"
                required={false}
              />*/}
                <InputField
                  type="text"
                  label={intl.formatMessage(address.fullName)}
                  name="shippingFullName"
                  required={true}
                  readOnly={readOnly}
                />
                {/*<InputField
                type="text"
                label={intl.formatMessage(address.description)}
                name="billing_description"
                required={false}
              />*/}
                <InputField
                  type="text"
                  label={intl.formatMessage(address.company)}
                  name="shippingCompany"
                  required={false}
                  readOnly={readOnly}
                />
                <SelectField
                  label={intl.formatMessage(address.country)}
                  name="shippingCountry"
                  required={true}
                  placeholder={intl.formatMessage(address.chooseCountry)}
                  options={countries.map((country) => ({
                    value: country.code,
                    label: country.name,
                  }))}
                  readOnly={readOnly}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.street1)}
                  name="shippingStreetLine1"
                  required={true}
                  readOnly={readOnly}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.street2)}
                  name="shippingStreetLine2"
                  required={false}
                  readOnly={readOnly}
                />
                {/*<InputField
                type="text"
                label={intl.formatMessage(address.postOfficeBox)}
                name="billing_post_office_box"
                required={false}
                readOnly={readOnly}
              />*/}
                <InputField
                  type="text"
                  label={intl.formatMessage(address.postalCode)}
                  name="shippingPostalCode"
                  required={true}
                  readOnly={readOnly}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.city)}
                  name="shippingCity"
                  required={true}
                  readOnly={readOnly}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.province)}
                  name="shippingProvince"
                  required={true}
                  readOnly={readOnly}
                />
                <InputField
                  type="text"
                  label={intl.formatMessage(address.phone)}
                  name="shippingPhoneNumber"
                  required={true}
                  readOnly={readOnly}
                />
              </div>
            )}
          </Box>
        </Flex>
        <br />
        <Button
          fullWidth
          onClick={handleSubmit}
          controlled
          state={isValid && enabled ? status : "disabled"}
        >
          {intl.formatMessage(messages.continue)}
        </Button>
      </Form>
    );
  }
);

const CheckoutAddressForm = withFormik<IProps, FormValues>({
  enableReinitialize: true,
  isInitialValid: true,
  mapPropsToValues: ({
    billingAddress = null,
    shippingAddress = null,
    customer = null,
  }) => {
    const isBillingAddress = !Object.values(billingAddress).reduce(
      (b, v) => b && v === null,
      true
    );
    const isShippingAddress = !Object.values(shippingAddress).reduce(
      (b, v) => b && v === null,
      true
    );
    //if only one is set, use for billing
    const bAddress = isBillingAddress ? billingAddress : shippingAddress;
    const sAddress = isBillingAddress ? shippingAddress : null;

    const values: FormValues = {
      billingFirstName: customer ? customer.firstName : "",
      billingLastName: customer ? customer.lastName : "",
      billingCompany: bAddress.company || "",
      billingStreetLine1: bAddress.streetLine1 || "",
      billingStreetLine2: bAddress.streetLine2 || "",
      billingCity: bAddress.city || "",
      billingProvince: bAddress.province || "",
      billingPostalCode: bAddress.postalCode || "",
      billingCountry:
        "countryCode" in bAddress
          ? bAddress.countryCode || ""
          : typeof bAddress.country === "string"
          ? ""
          : bAddress?.country?.code || "",
      billingPhone: bAddress.phoneNumber || "",
      billingEmail: customer ? customer.emailAddress : "",
    };

    if (isShippingAddress && sAddress) {
      values.shippingFullName = sAddress.fullName || "";
      values.shippingCompany = sAddress.company || "";
      values.shippingStreetLine1 = sAddress.streetLine1 || "";
      values.shippingStreetLine2 = sAddress.streetLine2 || "";
      values.shippingCity = sAddress.city || "";
      values.shippingProvince = sAddress.province || "";
      values.shippingPostalCode = sAddress.postalCode || "";
      values.shippingCountry =
        "countryCode" in sAddress
          ? sAddress.countryCode || ""
          : typeof sAddress.country === "string"
          ? ""
          : sAddress?.country?.code || "";
      values.shippingPhoneNumber = sAddress.postalCode || "";

      values.shipToDifferentAddress = true;
    }

    return values;
  },

  validationSchema: ({ countries, intl }: IProps) => {
    const countryCodes = countries.map((country) => country.code);

    return yup.object().shape({
      shipToDifferentAddress: yup.bool().default(false),

      /*billing_additional_line_above: yup.string(),
        shipping_additional_line_above: yup.string(),*/

      billingFirstName: yup.string().required(),
      billingLastName: yup.string().required(),
      shippingFullName: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired(),
      }),

      /*billing_description: yup.string(),
        shipping_description: yup.string(),*/

      billingCompany: yup.string(),
      shippingCompany: yup.string(),

      billingCountry: yup.string().oneOf(countryCodes).required(),
      shippingCountry: yup
        .string()
        .oneOf(countryCodes)
        .when("shipToDifferentAddress", {
          is: true,
          then: yup.string().oneOf(countryCodes).required(),
          otherwise: yup.string().oneOf(countryCodes).notRequired(),
        }),

      billingStreetLine1: yup.string().required(),
      shippingStreetLine1: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired(),
      }),

      billingStreetLine2: yup.string().notRequired(),
      shippingSteetLine2: yup.string().notRequired(),

      /*billing_post_office_box: yup.string(),
        shipping_post_office_box: yup.string(),*/

      billingPostalCode: yup.string().required(),
      shippingPostalCode: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired(),
      }),

      billingCity: yup.string().required(),
      shippingCity: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired(),
      }),

      billingProvince: yup.string().required(),
      shippingProvince: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: yup.string().required(),
        otherwise: yup.string().notRequired(),
      }),

      billingPhone: yup
        .string()
        .test(
          "test-phone",
          intl.formatMessage(messages.errorPhoneNumber),
          (value) => /^[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}$/.test(value)
        )
        .required(),
      shippingPhone: yup
        .string()
        .test(
          "test-phone",
          intl.formatMessage(messages.errorPhoneNumber),
          (value) => /^[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}$/.test(value)
        )
        .required()
        .notRequired(),

      billingEmail: yup.string().email().required(),
    });
  },
  handleSubmit: async (
    values,
    { props: { intl, customer, token, onProceed }, setStatus, setErrors }
  ) => {
    const billingAddress: CreateAddressInput = {
      fullName: `${values.billingFirstName} ${values.billingLastName}`,
      company: values.billingCompany,
      streetLine1: values.billingStreetLine1,
      streetLine2: values.billingStreetLine2,
      city: values.billingCity,
      province: values.billingProvince,
      postalCode: values.billingPostalCode,
      countryCode: values.billingCountry,
      phoneNumber: values.billingPhone,
      defaultBillingAddress: true,
    };

    const shippingAddress: CreateAddressInput = values.shipToDifferentAddress
      ? {
          fullName: values.shippingFullName,
          company: values.shippingCompany,
          streetLine1: values.shippingStreetLine1,
          streetLine2: values.shippingStreetLine2,
          city: values.shippingCity,
          province: values.shippingProvince,
          postalCode: values.shippingPostalCode,
          countryCode: values.shippingCountry,
          phoneNumber: values.shippingPhoneNumber,
          defaultShippingAddress: true,
        }
      : billingAddress;

    if (values.shipToDifferentAddress) {
      billingAddress.defaultShippingAddress = true;
    }

    if (customer) {
      //do something
    } else {
      const response = await request<{
        setCustomerForOrder: Mutation["setCustomerForOrder"];
      }>(intl.locale, ORDER_SET_CUSTOMER, {
        customer: {
          firstName: values.billingFirstName,
          lastName: values.billingLastName,
          phoneNumber: values.billingPhone,
          emailAddress: values.billingEmail,
        },
      });

      if ("errorCode" in response.setCustomerForOrder) {
        setErrors({
          billingFirstName: errorCodeToMessage(
            intl,
            response.setCustomerForOrder
          ),
        });
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
        return;
      }
    }

    const billingRequest = await request<{
      setOrderShippingAddress: Mutation["setOrderShippingAddress"];
      setOrderBillingAddress: Mutation["setOrderBillingAddress"];
    }>(intl.locale, ORDER_SET_ADDRESS, {
      shippingAddress,
      billingAddress,
    });

    if ("errorCode" in billingRequest.setOrderShippingAddress) {
      setErrors({
        billingFirstName: errorCodeToMessage(
          intl,
          billingRequest.setOrderShippingAddress
        ),
      });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
      return;
    }

    if ("errorCode" in billingRequest.setOrderBillingAddress) {
      setErrors({
        billingFirstName: errorCodeToMessage(
          intl,
          billingRequest.setOrderBillingAddress
        ),
      });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
      return;
    }

    mutate(
      [GET_ACTIVE_ORDER, token],
      { activeOrder: billingRequest.setOrderBillingAddress },
      false
    );

    onProceed();
  },
})(InnerCheckoutAddressForm);

export default CheckoutAddressForm;
