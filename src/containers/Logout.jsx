import React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import { logout } from "../actions/authentication";
import Card from "../components/Card";
import { getLanguage } from "../reducers";
/**
 * The login page
 * @returns {Component} The component
 */
class Logout extends React.PureComponent {
  componentDidMount = () => {
    this.props.logout();
  };

  render = () => {
    return <Card>Abmelden...</Card>;
  };
}

const mapStateToProps = state => ({ language: getLanguage(state) });
const mapDispatchToProps = dispatch => ({
  dispatch,
  /**
   * Logs a user out
   * @param {string} language The language
   * @returns {Promise} The fetch promise
   */
  logout(language) {
    const promise = dispatch(logout());
    dispatch(push(`/${language}/`));
    return promise;
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Logs a user out
   * @returns {Promise} The fetch promise
   */
  logout() {
    return mapDispatchToProps.logout(mapStateToProps.language);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Logout);
