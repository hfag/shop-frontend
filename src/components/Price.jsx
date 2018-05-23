import React from "react";
import PropTypes from "prop-types";
/**
 * Renders a price
 * @returns {Component} The component
 */
class Price extends React.PureComponent {
  render = () => {
    const { children, strike } = this.props;
    const Component = strike ? "strike" : "span";

    return (
      <Component>
        CHF {parseFloat(Math.round(children * 100) / 100).toFixed(2)}
      </Component>
    );
  };
}

Price.propTypes = {
  children: PropTypes.number.isRequired,
  strike: PropTypes.bool
};

export default Price;
