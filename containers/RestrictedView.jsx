import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getAccount } from "../reducers";

/**
 * Renders the children only if the condition is met
 * @returns {Component} The component
 */
class RestrictedView extends React.PureComponent {
  static propTypes = {
    userRole: PropTypes.string
  };

  render = () => {
    const { userRole = "administrator", account, children } = this.props;
    return account && userRole === account.role ? children : null;
  };
}

const mapStateToProps = state => ({
  account: getAccount(state)
});

export default connect(mapStateToProps)(RestrictedView);
