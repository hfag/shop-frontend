import React from "react";
import { withFormik, Form } from "formik";
import * as yup from "yup";
import PropTypes from "prop-types";
import styled from "styled-components";
import { defineMessages, injectIntl, intlShape } from "react-intl";

import Button from "../Button";
import InputField from "../InputField";
import address from "../../i18n/address";
import form from "../../i18n/form";
import validation from "../../i18n/validation";

const FormWrapper = styled(Form)`
  h2 {
    margin-top: 0;
  }
`;

const messages = defineMessages({
  password: {
    id: "AccountForm.password",
    defaultMessage: "Aktuelles Passwort (leer lassen um nichts zu ändern)"
  },
  newPassword: {
    id: "AccountForm.newPassword",
    defaultMessage: "Neues Passwort (leer lassen um nichts zu ändern)"
  },
  passwordConfirmation: {
    id: "AccountForm.passwordConfirmation",
    defaultMessage: "Bestätige das neue Passwort"
  }
});

/**
 * The inner account form
 * @param {Object} params The formik params
 * @returns {Component} The component
 */
const InnerAccountForm = React.memo(
  injectIntl(({ dirty, isValid, status = "", intl }) => (
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
  ))
);

const AccountForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ values: { firstName, lastName, email } }) => ({
    firstName,
    lastName,
    email
  }),
  validationSchema: ({ intl }) => {
    const isRequiredString = intl.formatMessage(validation.isRequired);

    return yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
      password: yup
        .string()
        .test("is-required", isRequiredString, function(value) {
          const { newPassword, passwordConfirmation } = this.parent;
          return newPassword || passwordConfirmation ? value : true;
        }),
      newPassword: yup
        .string()
        .min(7)
        .test("is-required", isRequiredString, function(value) {
          const { password, passwordConfirmation } = this.parent;
          return password || passwordConfirmation ? value : true;
        })
        .oneOf(
          [yup.ref("passwordConfirmation")],
          intl.formatMessage(validation.passwordsMustMatch)
        ),
      passwordConfirmation: yup
        .string()
        .min(7)
        .when(["password", "newPassword"], (password, newPassword, schema) =>
          password || newPassword ? schema.required() : schema
        )
        .test("is-required", isRequiredString, function(value) {
          const { password, newPassword } = this.parent;
          return password || newPassword ? value : true;
        })
    });
  },
  handleSubmit: (
    { firstName, lastName, email, password, newPassword },
    {
      props: { updateAccount },
      setStatus
      /* setErrors, setValues, setStatus, and other goodies */
    }
  ) => {
    setStatus("loading");
    updateAccount(firstName, lastName, email, password, newPassword)
      .then(() => {
        if (password && newPassword) {
          window.location = "/logout";
          return;
        }
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
})(InnerAccountForm);

AccountForm.propTypes = {
  intl: intlShape.isRequired,
  updateAccount: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

export default injectIntl(AccountForm);
