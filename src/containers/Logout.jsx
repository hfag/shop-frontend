import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { logout } from "../actions/authentication";
import Container from "../components/Container";
import Card from "../components/Card";
/**
 * The login page
 * @returns {Component} The component
 */
class Logout extends React.PureComponent {
  componentDidMount = () => {
    this.props.logout();
  };

  render = () => {
    return (
      <Container>
        <Card>Abmelden...</Card>
      </Container>
    );
  };
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  dispatch,
  /**
   * Logs a user out
   * @returns {Promise} The fetch promise
   */
  logout() {
    const promise = dispatch(logout());
    dispatch(push("/"));
    return promise;
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);
