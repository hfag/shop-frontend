import React from "react";
import { withFormik, Form } from "formik";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import * as yup from "yup";
import { Flex, Box } from "grid-styled";
import queryString from "query-string";
import { Helmet } from "react-helmet";

import { login, register, logout } from "../actions/authentication";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Card from "../components/Card";
import { getIsAuthenticated } from "../reducers";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The inner login form
 * @param {Object} params The formik params
 * @returns {Component} The component
 */
const InnerLoginRegisterForm = ({
  isValid,
  status = "",
  submitText = "Abschicken"
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
    <br />
    <Button fullWidth controlled state={isValid ? status : "disabled"}>
      {submitText}
    </Button>
  </Form>
);

const LoginRegisterForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({}),
  validationSchema: yup.object().shape({
    username: yup
      .string()
      /*.email()*/
      .required(),
    password: yup
      .string()
      .min(7)
      .required()
  }),
  handleSubmit: (
    { username, password },
    {
      props: { action, callback },
      setStatus
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
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
      });
  }
})(InnerLoginRegisterForm);

/**
 * The login page
 * @returns {Component} The component
 */
class Login extends React.PureComponent {
  constructor() {
    super();

    this.state = { registered: false, redirect: undefined };
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
    const { dispatch, login, register } = this.props;
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
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
            <h1>Anmelden</h1>
            <LoginRegisterForm
              action={login}
              callback={() => dispatch(push("/konto"))}
              submitText="Anmelden"
            />
          </Box>
          <Box width={[1, 1, 1 / 2, 1 / 2]} pr={3}>
            {this.state.registered && (
              <div>Sie sollten in Kürze eine Bestätigungsemail erhalten.</div>
            )}
            <h1>Neues Kundenkonto anlegen</h1>
            <LoginRegisterForm
              action={register}
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
