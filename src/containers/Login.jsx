import React, { useState, useEffect } from "react";
import { withFormik, Form } from "formik";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as yup from "yup";
import { Flex, Box } from "reflexbox";
import queryString from "query-string";
import { Helmet } from "react-helmet";
import { defineMessages, injectIntl, useIntl } from "react-intl";

import {
  login,
  register,
  logout,
  resetPassword
} from "../actions/authentication";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  getIsAuthenticated,
  getLanguage,
  getLanguageFetchString
} from "../reducers";
import Message from "../components/Message";
import { pathnamesByLanguage } from "../utilities/urls";
import address from "../i18n/address";
import user from "../i18n/user";
import validation from "../i18n/validation";
import { trackPageView } from "../utilities/analytics";
import { fetchShoppingCart } from "../actions/shopping-cart";

const messages = defineMessages({
  siteTitle: {
    id: "Login.siteTitle",
    defaultMessage: "Anmelden bei der Hauser Feuerschutz AG"
  },
  siteDescription: {
    id: "Login.siteDescription",
    defaultMessage:
      "Melden Sie sich mit Ihrem Kundenkonto bei der Hauser Feuerschutz AG an um Ihre bisherigen Bestellungen zu sehen oder Ihre Benutzerdaten zu bearbeiten."
  },
  reset: {
    id: "Login.reset",
    defaultMessage: "Zurücksetzen"
  },
  emailAlreadyExists: {
    id: "Login.emailAlreadyExists",
    defaultMessage: "Diese E-Mail wurde bereits registriert!"
  },
  wrongPassword: {
    id: "Login.wrongPassword",
    defaultMessage: "Das Passwort stimmt nicht!"
  },
  unknownError: {
    id: "Login.unknownError",
    defaultMessage: "Es ist ein unbekannter Fehler aufgetreten!"
  },
  passwordForgotten: {
    id: "Login.passwordForgotten",
    defaultMessage: "Passwort vergessen?"
  },
  confirmationEmail: {
    id: "Login.confirmationEmail",
    defaultMessage: "Sie sollten in Kürze eine E-Mail erhalten."
  },
  newAccount: {
    id: "Login.newAccount",
    defaultMessage: "Neues Kundenkonto anlegen"
  },
  createAccount: {
    id: "Login.createAccount",
    defaultMessage: "Kundenkonto anlegen"
  }
});

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The inner login form
 * @param {Object} params The formik params
 * @returns {Component} The component
 */
const InnerLoginRegisterForm = ({
  isValid,
  status = "",
  submitText = "Abschicken",
  message = "",
  confirmation = false
}) => {
  const intl = useIntl();

  return (
    <Form>
      <InputField
        type="text"
        label={intl.formatMessage(address.email)}
        name="username"
        required={true}
      />
      <InputField
        type="password"
        label={intl.formatMessage(user.password)}
        name="password"
        required={true}
      />
      {confirmation && (
        <InputField
          type="password"
          label={intl.formatMessage(validation.passwordConfirmation)}
          name="passwordConfirmation"
          required={true}
        />
      )}
      <br />
      {message}
      <Button fullWidth controlled state={isValid ? status : "disabled"}>
        {submitText}
      </Button>
    </Form>
  );
};

/**
 * The inner login form
 * @param {Object} params The formik params
 * @returns {Component} The component
 */
const InnerPasswordResetForm = ({ isValid, status = "", message = "" }) => {
  const intl = useIntl();
  return (
    <Form>
      <InputField
        type="text"
        label={intl.formatMessage(address.email)}
        name="username"
        required={true}
      />
      <br />
      {message}
      <Button fullWidth controlled state={isValid ? status : "disabled"}>
        {intl.formatMessage(messages.reset)}
      </Button>
    </Form>
  );
};

const LoginRegisterForm = injectIntl(
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => ({}),
    validationSchema: ({ confirmation, intl }) =>
      yup.object().shape({
        username: yup
          .string()
          /*.email()*/
          .required(),
        password: yup
          .string()
          .when([], schema =>
            confirmation
              ? schema
                  .min(7)
                  .oneOf(
                    [yup.ref("passwordConfirmation")],
                    intl.formatMessage(validation.passwordsMustMatch)
                  )
              : schema
          )
          .required(),
        passwordConfirmation: yup
          .string()
          .min(7)
          .when([], schema => (confirmation ? schema.required() : schema))
      }),
    handleSubmit: (
      { username, password },
      {
        props: { action, intl, callback },
        setStatus,
        setErrors
        /* setErrors, setValues, setStatus, and other goodies */
      }
    ) => {
      setStatus("loading");
      action(username, password)
        .then(() => {
          setStatus("success");
          setTimeout(() => {
            setStatus("");
            callback();
          }, 300);
        })
        .catch(e => {
          switch (e) {
            case "existing_user_email":
              setErrors({
                username: intl.formatMessage(messages.emailAlreadyExists)
              });
              break;
            case "incorrect_password":
              setErrors({
                password: intl.formatMessage(messages.wrongPassword)
              });
              break;
            default:
              setErrors({
                password: intl.formatMessage(messages.unknownError)
              });
              break;
          }

          setStatus("error");
          setTimeout(() => setStatus(""), 300);
        });
    }
  })(InnerLoginRegisterForm)
);

const PasswordResetForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({}),
  validationSchema: yup.object().shape({
    username: yup
      .string()
      .email()
      .required()
  }),
  handleSubmit: (
    { username },
    {
      props: { resetPassword, callback },
      setStatus
      /* setErrors, setValues, setStatus, and other goodies */
    }
  ) => {
    setStatus("loading");
    resetPassword(username)
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          setStatus("");
          callback();
        }, 300);
      })
      .catch(e => {
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
      });
  }
})(InnerPasswordResetForm);

const Login = React.memo(
  ({
    resetAuthentication,
    isAuthenticated,
    language,
    languageFetchString,
    dispatch,
    login,
    register,
    resetPassword
  }) => {
    const intl = useIntl();

    const [didRegister, setDidRegister] = useState(false);
    const [didResetPassword, setDidResetPassword] = useState(false);
    const [redirect, setRedirect] = useState(undefined);

    useEffect(() => {
      const { redirect } = queryString.parse(location.search);

      if (redirect) {
        setRedirect(redirect);
      }

      if (redirect && isAuthenticated) {
        resetAuthentication();
      }

      trackPageView();
    }, []);

    return (
      <Card>
        <Helmet>
          <title>
            {intl.formatMessage(messages.siteTitle)} - Hauser Feuerschutz AG
          </title>
          <meta
            name="description"
            content={intl.formatMessage(messages.siteDescription)}
          />
          <link
            rel="canonical"
            href={`${ABSOLUTE_URL}/${pathnamesByLanguage[language].login}`}
          />
        </Helmet>
        <Flex flexWrap="wrap">
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3} pb={3}>
            <h1>{intl.formatMessage(user.login)}</h1>
            <LoginRegisterForm
              action={login}
              callback={() => {
                dispatch(fetchShoppingCart(languageFetchString, true));
                dispatch(
                  push(`/${language}/${pathnamesByLanguage[language].account}`)
                );
              }}
              submitText={intl.formatMessage(user.login)}
            />
            <h1>{intl.formatMessage(messages.passwordForgotten)}</h1>
            <PasswordResetForm
              resetPassword={resetPassword}
              message={
                didResetPassword && (
                  <Message>
                    {intl.formatMessage(messages.confirmationEmail)}
                  </Message>
                )
              }
              callback={() => setDidResetPassword(true)}
            />
          </Box>
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3} pb={3}>
            <h1>{intl.formatMessage(messages.newAccount)}</h1>
            <LoginRegisterForm
              action={register}
              confirmation
              message={
                didRegister && (
                  <Message>
                    {intl.formatMessage(messages.confirmationEmail)}
                  </Message>
                )
              }
              callback={() => setDidRegister(true)}
              submitText={intl.formatMessage(messages.createAccount)}
            />
          </Box>
        </Flex>
      </Card>
    );
  }
);

const mapStateToProps = state => ({
  language: getLanguage(state),
  languageFetchString: getLanguageFetchString(state),
  isAuthenticated: getIsAuthenticated(state)
});
const mapDispatchToProps = dispatch => ({
  dispatch,
  /**
   * Resets the jwt token
   * @returns {void}
   */
  resetAuthentication() {
    return dispatch(logout());
  },
  /**
   * Logs a user in
   * @param {string} username The email/username
   * @param {string} password The password
   * @param {boolean} visualize Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  login(username, password, visualize = true) {
    return dispatch(login(username, password, visualize));
  },
  /**
   * Registers a user
   * @param {string} username The email/username
   * @param {string} password The password
   * @param {boolean} visualize Whether to visualize the progress
   * @returns {Promise} The fetch promise
   */
  register(username, password, visualize = true) {
    return dispatch(register(username, password, visualize));
  },
  /**
   * Resets a user password
   * @param {string} username The username/email
   * @returns {Promise} The fetch promise
   */
  resetPassword(username) {
    return dispatch(resetPassword(username));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
