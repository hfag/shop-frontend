import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledPrice = styled.span`
  text-decoration: ${({ strike }) => (strike ? "line-through" : "none")};
  white-space: nowrap;
`;

/**
 * Renders a price
 * @returns {Component} The component
 */
class Price extends React.PureComponent {
  render = () => {
    const { children, strike } = this.props;

    return (
      <StyledPrice strike={strike}>
        CHF {parseFloat(Math.round(children * 100) / 100).toFixed(2)}
      </StyledPrice>
    );
  };
}

Price.propTypes = {
  children: PropTypes.number.isRequired,
  strike: PropTypes.bool
};

export default Price;
