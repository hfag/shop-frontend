import React from "react";
import ReactGA from "react-ga";

ReactGA.initialize(process.env.GA_TRACKING_ID, { titleCase: false });

/**
 * Renders the google analytics component
 * @returns {Component} The analytics component
 */
class GoogleAnalyticsTracker extends React.Component {
  /**
   * Lifecycle method called after the component mounted
   * @returns {void}
   */
  componentDidMount() {
    this.sendPageChange(
      this.props.location.pathname,
      this.props.location.search
    );
  }

  /**
   * Method called after the component updated
   * @param {Object} prevProps The previous properties
   * @returns {void}
   */
  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname ||
      this.props.location.search !== prevProps.location.search
    ) {
      this.sendPageChange(
        this.props.location.pathname,
        this.props.location.search
      );
    }
  }

  /**
   * Sends a page change to google analytics
   * @param {string} pathname The path part of the url
   * @param {string} search The search part of the url
   * @returns {void}
   */
  sendPageChange(pathname, search = "") {
    const page = pathname + search;
    ReactGA.ga("set", "anonymizeIp", true);
    ReactGA.set({ page });
    ReactGA.pageview(page);
  }

  /**
   * Renders the component
   * @returns {Component} The component
   */
  render() {
    return null;
  }
}

export default GoogleAnalyticsTracker;
