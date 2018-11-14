import React from "react";
import { withFormik, Form } from "formik";
import * as yup from "yup";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "../Button";
import InputField from "../InputField";

const FormWrapper = styled(Form)`
  h2 {
    margin-top: 0;
  }
`;

/**
 * The inner account form
 * @param {Object} params The formik params
 * @returns {Component} The component
 */
const InnerAccountForm = ({ dirty, isValid, status = "" }) => (
  <FormWrapper>
    <h2>Konto-Details</h2>
    <InputField type="text" label="Vorname" name="firstName" required={true} />
    <InputField type="text" label="Nachname" name="lastName" required={true} />
    <InputField
      type="text"
      label="E-Mail Adresse"
      name="email"
      required={true}
    />
    <InputField
      type="password"
      label="Aktuelles Passwort (leer lassen um nichts zu ändern)"
      name="password"
    />
    <InputField
      type="password"
      label="Neues Passwort (leer lassen um nichts zu ändern)"
      name="newPassword"
    />
    <InputField
      type="password"
      label="Bestätige das neue Passwort"
      name="passwordConfirmation"
    />
    <br />
    <Button fullWidth controlled state={isValid ? status : "disabled"}>
      Änderungen speichern
    </Button>
  </FormWrapper>
);

const AccountForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ values: { firstName, lastName, email } }) => ({
    firstName,
    lastName,
    email
  }),
  validationSchema: yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup
      .string()
      .email()
      .required(),
    password: yup
      .string()
      .test("is-required", "Dieses Feld darf nicht leer sein", function(value) {
        const { newPassword, passwordConfirmation } = this.parent;
        return newPassword || passwordConfirmation ? value : true;
      }),
    newPassword: yup
      .string()
      .min(7)
      .test("is-required", "Dieses Feld darf nicht leer sein", function(value) {
        const { password, passwordConfirmation } = this.parent;
        return password || passwordConfirmation ? value : true;
      })
      .oneOf(
        [yup.ref("passwordConfirmation")],
        "Die beiden Passwörter müssen übereinstimmen!"
      ),
    passwordConfirmation: yup
      .string()
      .min(7)
      .when(
        ["password", "newPassword"],
        (password, newPassword, schema) =>
          password || newPassword ? schema.required() : schema
      )
      .test("is-required", "Dieses Feld darf nicht leer sein", function(value) {
        const { password, newPassword } = this.parent;
        return password || newPassword ? value : true;
      })
  }),
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
  updateAccount: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

export default AccountForm;
