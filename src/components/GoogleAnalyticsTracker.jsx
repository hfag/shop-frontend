import React from "react";

/**
 * Renders the google analytics component
 * @returns {Component} The analytics component
 */
class GoogleAnalyticsTracker extends React.PureComponent {
  render() {
    return (
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-M72QNLR"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    );
  }
}

export default GoogleAnalyticsTracker;
