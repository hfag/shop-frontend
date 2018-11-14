import React from "react";
import { withFormik, Form } from "formik";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import * as yup from "yup";
import { Flex, Box } from "grid-styled";
import queryString from "query-string";
import { Helmet } from "react-helmet";

import {
  login,
  register,
  logout,
  resetPassword
} from "../actions/authentication";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Card from "../components/Card";
import { getIsAuthenticated } from "../reducers";
import Message from "../components/Message";

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
}) => (
  <Form>
    <InputField
      type="text"
      label="E-Mail Adresse"
      name="username"
      required={true}
    />
    <InputField
      type="password"
      label="Passwort"
      name="password"
      required={true}
    />
    {confirmation && (
      <InputField
        type="password"
        label="Passwort bestätigen"
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

/**
 * The inner login form
 * @param {Object} params The formik params
 * @returns {Component} The component
 */
const InnerPasswordResetForm = ({ isValid, status = "", message = "" }) => (
  <Form>
    <InputField
      type="text"
      label="E-Mail Adresse"
      name="username"
      required={true}
    />
    <br />
    {message}
    <Button fullWidth controlled state={isValid ? status : "disabled"}>
      Zurücksetzen
    </Button>
  </Form>
);

const LoginRegisterForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({}),
  validationSchema: ({ confirmation }) =>
    yup.object().shape({
      username: yup
        .string()
        /*.email()*/
        .required(),
      password: yup
        .string()
        .when(
          [],
          schema =>
            confirmation
              ? schema
                  .min(7)
                  .oneOf(
                    [yup.ref("passwordConfirmation")],
                    "Die beiden Passwörter müssen übereinstimmen!"
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
      props: { action, callback },
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
              username: "Diese E-Mail wurde bereits registriert!"
            });
            break;
          case "incorrect_password":
          default:
            setErrors({ password: "Das Passwort stimmt nicht!" });
            break;
        }

        setStatus("error");
        setTimeout(() => setStatus(""), 300);
      });
  }
})(InnerLoginRegisterForm);

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

/**
 * The login page
 * @returns {Component} The component
 */
class Login extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      registered: false,
      resetPassword: false,
      redirect: undefined
    };
  }

  componentDidMount = () => {
    const { redirect } = queryString.parse(location.search);

    const { resetAuthentication, isAuthenticated } = this.props;

    if (redirect) {
      this.setState({ redirect });
    }

    if (redirect && isAuthenticated) {
      resetAuthentication();
    }
  };

  render = () => {
    const { dispatch, login, register, resetPassword } = this.props;
    return (
      <Card>
        <Helmet>
          <title>Anmelden bei der Hauser Feuerschutz AG</title>
          <meta
            name="description"
            content="Melden Sie sich mit Ihrem Kundenkonto bei der Hauser Feuerschutz AG an um Ihre bisherigen Bestellungen zu sehen oder Ihre Benutzerdaten zu bearbeiten."
          />
          <link rel="canonical" href={ABSOLUTE_URL + "/login"} />
        </Helmet>
        <Flex flexWrap="wrap">
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3} pb={3}>
            <h1>Anmelden</h1>
            <LoginRegisterForm
              action={login}
              callback={() => dispatch(push("/konto"))}
              submitText="Anmelden"
            />
            <h1>Passwort vergessen?</h1>
            <PasswordResetForm
              resetPassword={resetPassword}
              message={
                this.state.resetPassword && (
                  <Message>Sie sollten in Kürze eine E-Mail erhalten.</Message>
                )
              }
              callback={() => this.setState({ resetPassword: true })}
            />
          </Box>
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3} pb={3}>
            <h1>Neues Kundenkonto anlegen</h1>
            <LoginRegisterForm
              action={register}
              confirmation
              message={
                this.state.registered && (
                  <Message>
                    Sie sollten in Kürze eine Bestätigungsemail erhalten.
                  </Message>
                )
              }
              callback={() => this.setState({ registered: true })}
              submitText="Kundenkonto anlegen"
            />
          </Box>
        </Flex>
      </Card>
    );
  };
}

const mapStateToProps = state => ({
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
