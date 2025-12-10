import * as yup from "yup";
import { Field, Form, FormikProps, withFormik } from "formik";
import { IntlShape, defineMessages } from "react-intl";
import React from "react";

import {
  Address,
  Country,
  CreateAddressInput,
  Customer,
  Mutation,
  OrderAddress,
  Query,
} from "../../schema";
import {
  GET_ACTIVE_ORDER,
  ORDER_GET_SHIPPING_METHODS,
  ORDER_SET_ADDRESS,
  ORDER_SET_CUSTOMER,
} from "../../gql/order";
import { ORDER_SET_SHIPPING_METHOD } from "../../gql/order";
import { errorCodeToMessage } from "../../utilities/i18n";
import { mutate } from "swr";
import Box from "../layout/Box";
import Button from "../elements/Button";
import Flex from "../layout/Flex";
import InputField from "../form/InputField";
import SelectField from "../form/SelectField";
import address from "../../i18n/address";
import form from "../../i18n/form";
import request from "../../utilities/request";
import styled from "@emotion/styled";

const messages = defineMessages({
  shipToDifferentAddress: {
    id: "CheckoutAddressForm.shipToDifferentAddress",
    defaultMessage: "Lieferung an eine andere Adresse",
  },
  save: {
    id: "CheckoutAddressForm.saveAndContinue",
    defaultMessage: "Speichern und weiter",
  },
});

const ShipToDifferentAddress = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  margin-top: 1.25rem;
  margin-bottom: 0.625rem;

  h3 {
    margin: 0 0 0 0.5rem;
  }
`;

interface FormValues {
  billingFullName: string;
  billingCompany: string;
  billingStreetLine1: string;
  billingStreetLine2: string;
  billingCity: string;
  billingProvince: string;
  billingPostalCode: string;
  billingCountry: string; //country code
  billingPhone: string;
  billingEmail: string;

  shippingFullName: string;
  shippingCompany: string;
  shippingStreetLine1: string;
  shippingStreetLine2: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  shippingCountry: string; //country code
  shippingPhone: string;

  shipToDifferentAddress: boolean;
}

interface IProps {
  countries: Country[];
  token?: string | null;
  billingAddress?: Address | OrderAddress | null;
  shippingAddress?: Address | OrderAddress | null;
  user?: Customer | null;
  customer?: Customer | null;
  intl: IntlShape;
  enabled?: boolean;
  onProceed: () => void;
}

export const mapShippingMethodToOrder = (shippingMethod: string) => {
  switch (shippingMethod) {
    case "standard-shipping":
      return 0;
    case "sperrgut-lieferung":
      return 1;
    case "cargo-domizil":
      return 2;
    case "abholung":
      return 999;
    default:
      return 50;
  }
};

/**
 * The inner checkout form
 */
const InnerCheckoutAddressForm = React.memo(
  ({
    status,
    values,
    isValid,
    handleSubmit,
    countries,
    intl,
    enabled,
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
              label={intl.formatMessage(address.fullName)}
              name="billingFullName"
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
            <ShipToDifferentAddress>
              <Field
                type="checkbox"
                name="shipToDifferentAddress"
                readOnly={readOnly}
                disabled={readOnly}
              />
              <h3>
                <label htmlFor="shipToDifferentAddress">
                  {intl.formatMessage(messages.shipToDifferentAddress)}
                </label>
              </h3>
            </ShipToDifferentAddress>
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
                  name="shippingPhone"
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
          {intl.formatMessage(messages.save)}
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
    const isBillingAddress =
      !billingAddress ||
      !Object.values(billingAddress).reduce((b, v) => b && v === null, true);

    const isShippingAddress =
      !shippingAddress ||
      !Object.values(shippingAddress).reduce((b, v) => b && v === null, true);

    //if only one is set, use for billing
    const bAddress = isBillingAddress ? billingAddress : shippingAddress;
    const sAddress = isShippingAddress ? shippingAddress : null;

    const values: FormValues = {
      billingFullName: bAddress?.fullName || "",
      billingCompany: bAddress?.company || "",
      billingStreetLine1: bAddress?.streetLine1 || "",
      billingStreetLine2: bAddress?.streetLine2 || "",
      billingCity: bAddress?.city || "",
      billingProvince: bAddress?.province || "",
      billingPostalCode: bAddress?.postalCode || "",
      billingCountry:
        bAddress && "countryCode" in bAddress
          ? bAddress.countryCode || ""
          : typeof bAddress?.country === "string"
          ? ""
          : bAddress?.country?.code || "",
      billingPhone: bAddress?.phoneNumber || "",
      billingEmail: customer ? customer.emailAddress : "",

      shippingFullName: sAddress?.fullName || "",
      shippingCompany: sAddress?.company || "",
      shippingStreetLine1: sAddress?.streetLine1 || "",
      shippingStreetLine2: sAddress?.streetLine2 || "",
      shippingCity: sAddress?.city || "",
      shippingProvince: sAddress?.province || "",
      shippingPostalCode: sAddress?.postalCode || "",
      shippingCountry:
        sAddress && "countryCode" in sAddress
          ? sAddress?.countryCode || ""
          : typeof sAddress?.country === "string"
          ? ""
          : sAddress?.country?.code || "",
      shippingPhone: sAddress?.phoneNumber || "",

      shipToDifferentAddress: false,
    };

    if (sAddress && isShippingAddress) {
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

      billingFullName: yup.string().required(),
      shippingFullName: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
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
          then: (schema) => schema.oneOf(countryCodes).required(),
          otherwise: (schema) => schema.oneOf(countryCodes).notRequired(),
        }),

      billingStreetLine1: yup.string().required(),
      shippingStreetLine1: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),

      billingStreetLine2: yup.string().notRequired(),
      shippingSteetLine2: yup.string().notRequired(),

      /*billing_post_office_box: yup.string(),
        shipping_post_office_box: yup.string(),*/

      billingPostalCode: yup.number().required(),
      shippingPostalCode: yup.number().when("shipToDifferentAddress", {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),

      billingCity: yup.string().required(),
      shippingCity: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),

      billingProvince: yup.string().required(),
      shippingProvince: yup.string().when("shipToDifferentAddress", {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),

      billingPhone: yup
        .string()
        .test(
          "test-phone",
          intl.formatMessage(form.errorPhoneNumber),
          (value) =>
            !!value && /^[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}$/.test(value)
        )
        .required(),
      shippingPhone: yup
        .string()
        .test(
          "test-phone",
          intl.formatMessage(form.errorPhoneNumber),
          (value) =>
            value ? /^[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}$/.test(value) : true
        )
        .notRequired(),

      billingEmail: yup.string().email().required(),
    });
  },
  handleSubmit: async (
    values,
    { props: { intl, user, token, onProceed }, setStatus, setErrors }
  ) => {
    const billingAddress: CreateAddressInput = {
      fullName: values.billingFullName,
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
          phoneNumber: values.shippingPhone,
          //defaultShippingAddress: true,
        }
      : billingAddress;

    if (values.shipToDifferentAddress) {
      billingAddress.defaultShippingAddress = true;
    }

    if (user) {
      /*const response = await request<{
        updateCustomer: Mutation["updateCustomer"];
      }>(intl.locale, UPDATE_CUSTOMER, {
        input: {
          firstName: values.billingFirstName,
          lastName: values.billingLastName,
          phoneNumber: values.billingPhone,
        },
      });

      mutate([GET_CURRENT_USER, token]);

      if ("errorCode" in response.updateCustomer) {
        setErrors({
          billingEmail: errorCodeToMessage(intl, response.updateCustomer),
        });
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
        return;
      }*/
    } else {
      const billingName = (values.billingFullName || "").split(" ");
      const firstName = billingName.slice(0, -1).join(" ");
      const lastName = billingName.slice(-1).join(" ");

      const response = await request<{
        setCustomerForOrder: Mutation["setCustomerForOrder"];
      }>(intl.locale, ORDER_SET_CUSTOMER, {
        customer: {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: values.billingPhone,
          emailAddress: values.billingEmail,
        },
      });

      if ("errorCode" in response.setCustomerForOrder) {
        setErrors({
          billingEmail: errorCodeToMessage(intl, response.setCustomerForOrder),
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
        billingEmail: errorCodeToMessage(
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
        billingEmail: errorCodeToMessage(
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

    if (billingRequest.setOrderBillingAddress.state !== "ArrangingPayment") {
      const eligibleShippingMethods = await request<{
        eligibleShippingMethods: Query["eligibleShippingMethods"];
      }>(intl.locale, ORDER_GET_SHIPPING_METHODS);

      if (
        !eligibleShippingMethods.eligibleShippingMethods ||
        eligibleShippingMethods.eligibleShippingMethods.length < 1
      ) {
        setErrors({
          billingEmail:
            "Internal error: cannot ship this order. Please report this issue",
        });
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
        return;
      }

      // order shipping methods
      eligibleShippingMethods.eligibleShippingMethods.sort(
        (a, b) =>
          mapShippingMethodToOrder(a.code) - mapShippingMethodToOrder(b.code)
      );

      const setShipping = await request<{
        setOrderShippingMethod: Mutation["setOrderShippingMethod"];
      }>(intl.locale, ORDER_SET_SHIPPING_METHOD, {
        shippingMethodId: eligibleShippingMethods.eligibleShippingMethods[0].id,
      });

      if ("errorCode" in setShipping.setOrderShippingMethod) {
        setErrors({
          billingEmail: errorCodeToMessage(
            intl,
            setShipping.setOrderShippingMethod
          ),
        });
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
        return;
      }

      mutate(
        [GET_ACTIVE_ORDER, token],
        { activeOrder: setShipping.setOrderShippingMethod },
        false
      );
    }

    onProceed();
  },
})(InnerCheckoutAddressForm);

export default CheckoutAddressForm;
