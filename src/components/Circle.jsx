import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "utilities/style";

const CircleWrapper = styled.div`
	position: relative;
	padding: ${({ padding }) => (padding ? padding : "0.25rem")};
	border-radius: 50%;
	text-align: center;
	border: ${({ negative }) =>
    negative ? colors.primaryContrast : colors.primary}
		${({ thickness }) => (thickness ? thickness : "1px")} solid;

	color: ${({ filled, negative }) =>
    negative
      ? filled
        ? colors.primary
        : colors.primaryContrast
      : filled
      ? colors.primaryContrast
      : colors.primary}};

	${({ filled, negative }) =>
    filled
      ? `background-color: ${
          negative ? colors.primaryContrast : colors.primary
        };`
      : ""} ${({ width }) => (width ? `width: ${width};` : "")} ${({
  height
}) => (height ? `height: ${height};` : "")} ${({ inline }) =>
  inline ? `display: inline-block;` : ""};

  ${({ centerChildren }) =>
    centerChildren
      ? `
      & > div{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
	    }`
      : ""}
`;

/**
 * A components that draws a circle
 * @returns {Component} The component
 */
class Circle extends React.PureComponent {
  render = () => {
    return (
      <CircleWrapper {...this.props}>
        <div>{this.props.children}</div>
      </CircleWrapper>
    );
  };
}

Circle.propTypes = {
  padding: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  negative: PropTypes.bool,
  filled: PropTypes.bool,
  thickness: PropTypes.string,
  children: PropTypes.node,
  centerChildren: PropTypes.bool
};

export default Circle;
