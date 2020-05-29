import React, { useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { useIntl } from "react-intl";

import { logout } from "../actions/authentication";
import Card from "../components/Card";
import { getLanguage } from "../reducers";
import user from "../i18n/user";

const Logout = React.memo(({ logout }) => {
  const intl = useIntl();

  useEffect(() => {
    logout();
  }, []);

  return <Card>{intl.formatMessage(user.logout)}...</Card>;
});

const mapStateToProps = (state) => ({ language: getLanguage(state) });
const mapDispatchToProps = (dispatch) => ({
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
  },
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
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Logout);
