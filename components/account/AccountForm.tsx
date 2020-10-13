import React from "react";
import { withFormik, Form, FormikProps } from "formik";
import * as yup from "yup";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { defineMessages, injectIntl, useIntl, IntlShape } from "react-intl";

import address from "../../i18n/address";
import form from "../../i18n/form";
import validation from "../../i18n/validation";
import InputField from "../form/InputField";
import Button from "../elements/Button";
import request from "../../utilities/request";
import {
  UPDATE_CUSTOMER,
  UPDATE_CUSTOMER_PASSWORD,
  REQUEST_UPDATE_CUSTOMER_EMAIL,
  GET_CURRENT_CUSTOMER,
} from "../../gql/user";
import { mutate } from "swr";

const FormWrapper = styled(Form)`
  h2 {
    margin-top: 0;
  }
`;

const messages = defineMessages({
  unknownError: {
    id: "AccountForm.unknownError",
    defaultMessage:
      "Beim Aktualisieren ist ein unbekannter Fehler aufgetreten. Bitte kontaktieren Sie uns.",
  },
  newEmailError: {
    id: "AccountForm.newEmailError",
    defaultMessage:
      "Die E-Mail konnte nicht aktualisiert werden. Ist die neue Adresse gültig?",
  },
  newPasswordError: {
    id: "AccountForm.newPasswordError",
    defaultMessage: "Das Passwort konnte nicht geändert werden.",
  },
  password: {
    id: "AccountForm.password",
    defaultMessage: "Aktuelles Passwort (leer lassen um nichts zu ändern)",
  },
  newPassword: {
    id: "AccountForm.newPassword",
    defaultMessage: "Neues Passwort (leer lassen um nichts zu ändern)",
  },
  passwordConfirmation: {
    id: "AccountForm.passwordConfirmation",
    defaultMessage: "Bestätige das neue Passwort",
  },
});

interface FormValues {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  newPassword?: string;
  passwordConfirmation?: string;
}

interface IProps {
  intl: IntlShape;
  newEmailCallback: () => void;
  token: string | null;
  values: FormValues;
}
/**
 * The inner account form
 */
const InnerAccountForm = React.memo(
  ({ dirty, isValid, status = "", intl }: IProps & FormikProps<FormValues>) => (
    <FormWrapper>
      <h2>Konto-Details</h2>
      <InputField
        type="text"
        label={intl.formatMessage(address.firstName)}
        name="firstName"
        required={true}
      />
      <InputField
        type="text"
        label={intl.formatMessage(address.lastName)}
        name="lastName"
        required={true}
      />
      <InputField
        type="text"
        label={intl.formatMessage(address.email)}
        name="email"
        required={true}
      />
      <InputField
        type="password"
        label={intl.formatMessage(messages.password)}
        name="password"
      />
      <InputField
        type="password"
        label={intl.formatMessage(messages.newPassword)}
        name="newPassword"
      />
      <InputField
        type="password"
        label={intl.formatMessage(messages.passwordConfirmation)}
        name="passwordConfirmation"
      />
      <br />
      <Button fullWidth controlled state={isValid ? status : "disabled"}>
        {intl.formatMessage(form.saveChanges)}
      </Button>
    </FormWrapper>
  )
);

const AccountForm = withFormik<IProps, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: ({ values: { firstName, lastName, email } }) => ({
    firstName,
    lastName,
    email,
  }),
  validationSchema: ({ intl, values: { email: previousEmail } }) => {
    const isRequiredString = intl.formatMessage(validation.isRequired);

    return yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup
        .string()
        .test("is-required", isRequiredString, function (value) {
          const { newPassword, passwordConfirmation, email } = this.parent;
          return newPassword || passwordConfirmation || email !== previousEmail
            ? value
            : true;
        }),
      newPassword: yup
        .string()
        .min(7)
        .test("is-required", isRequiredString, function (value) {
          const { password, passwordConfirmation } = this.parent;
          return password && passwordConfirmation ? value : true;
        })
        .oneOf(
          [yup.ref("passwordConfirmation")],
          intl.formatMessage(validation.passwordsMustMatch)
        ),
      passwordConfirmation: yup
        .string()
        .min(7)
        .when(["newPassword"], (newPassword, schema) =>
          newPassword ? schema.required() : schema
        )
        .test("is-required", isRequiredString, function (value) {
          const { newPassword } = this.parent;
          return newPassword ? value : true;
        }),
    });
  },
  handleSubmit: async (
    { firstName, lastName, email, password, newPassword },
    {
      props: {
        intl,
        token,
        newEmailCallback,
        values: { email: previousEmail },
      },
      setStatus,
      setErrors,
    }
  ) => {
    setStatus("loading");

    try {
      const customerUpdate = await request(intl.locale, UPDATE_CUSTOMER, {
        input: { firstName, lastName },
      });
      mutate(
        [GET_CURRENT_CUSTOMER, token],
        { activeCustomer: customerUpdate.updateCustomer },
        false
      );
    } catch (e) {
      setErrors({
        passwordConfirmation: intl.formatMessage(messages.unknownError),
      });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
    }
    try {
      if (password && email !== previousEmail) {
        const emailUpdate = await request(
          intl.locale,
          REQUEST_UPDATE_CUSTOMER_EMAIL,
          {
            currentPassword: password,
            email,
          }
        );

        newEmailCallback();
      }
    } catch (e) {
      setErrors({
        passwordConfirmation: intl.formatMessage(messages.newEmailError),
      });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
    }

    try {
      if (password && newPassword) {
        const passwordUpdate = await request(
          intl.locale,
          UPDATE_CUSTOMER_PASSWORD,
          {
            password,
            newPassword,
          }
        );
      }
    } catch (e) {
      setErrors({
        passwordConfirmation: intl.formatMessage(messages.newPasswordError),
      });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
    }

    setStatus("success");
    setTimeout(() => {
      setStatus("");
    }, 300);
  },
})(InnerAccountForm);

export default AccountForm;
