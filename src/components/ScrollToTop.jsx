import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { toggleBurgerMenu } from "../actions/burger-menu";
import { getBurgerMenuOpen, getLanguage } from "../reducers";
import { pathnamesByLanguage } from "../utilities/urls";

/**
 * Scrolls to top on route change
 * @returns {Component} The component
 */
class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (
        this.props.burgerMenuOpen &&
        !this.props.location.pathname.includes(
          pathnamesByLanguage[this.props.language].productCategory
        )
      ) {
        this.props.dispatch(toggleBurgerMenu());
      }
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  language: getLanguage(state),
  burgerMenuOpen: getBurgerMenuOpen(state)
});
const ConnectedScrollToTop = connect(mapStateToProps)(ScrollToTop);

export default withRouter(ConnectedScrollToTop);
