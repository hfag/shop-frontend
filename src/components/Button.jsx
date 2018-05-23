import React from "react";
import styled from "styled-components";
import Color from "color";
import ProgressButton from "react-progress-button";

import { colors } from "../utilities/style";
const DISABLED = Color(colors.secondary)
  .lighten(0.5)
  .rgb()
  .string();

const ButtonWrapper = styled.div`
  .pb-container {
    display: inline-block;
    text-align: center;
    width: 100%;
  }
  .pb-container .pb-button {
    border: none;
    border-radius: 0;

    width: 100%;
    height: ${({ height }) => height};
    padding: 0.375rem 1rem;

    color: #fff;
    background-color: ${({ disabled }) =>
      disabled ? DISABLED : colors.secondary};

    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;

    cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};

    transition: all 0.3s ease-in-out;
    transition: background-color 0.15s ease-in-out;

    &:hover {
      background-color: ${({ disabled }) =>
        disabled
          ? DISABLED
          : Color(colors.secondary)
              .darken(0.25)
              .rgb()
              .string()};
    }
  }
  .pb-container .pb-button span {
    display: inherit;
    transition: opacity 0.3s 0.1s;
  }
  .pb-container .pb-button svg {
    height: ${({ height }) => height};
    width: ${({ height }) => height};
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .pb-container .pb-button svg path {
    opacity: 0;
    fill: none;
  }
  .pb-container .pb-button svg.pb-progress-circle {
    animation: spin 0.9s infinite cubic-bezier(0.085, 0.26, 0.935, 0.71);
  }
  .pb-container .pb-button svg.pb-progress-circle path {
    stroke: ${colors.secondary};
    stroke-width: 5;
  }
  .pb-container .pb-button svg.pb-checkmark path,
  .pb-container .pb-button svg.pb-cross path {
    stroke: #fff;
    stroke-linecap: round;
    stroke-width: 4;
  }
  .pb-container.disabled .pb-button {
    cursor: not-allowed;
  }
  .pb-container.loading .pb-button {
    width: ${({ height }) => height};
    border-width: 6.5px;
    border-color: #ddd;
    cursor: wait;
    background-color: transparent;
    padding: 0;
  }
  .pb-container.loading .pb-button span {
    transition: all 0.15s;
    opacity: 0;
    display: none;
  }
  .pb-container.loading .pb-button .pb-progress-circle > path {
    transition: opacity 0.15s 0.3s;
    opacity: 1;
  }
  .pb-container.success .pb-button {
    background-color: ${colors.success};
  }
  .pb-container.success .pb-button span {
    transition: all 0.15s;
    opacity: 0;
    display: none;
  }
  .pb-container.success .pb-button .pb-checkmark > path {
    opacity: 1;
  }
  .pb-container.error .pb-button {
    background-color: ${colors.danger};
  }
  .pb-container.error .pb-button span {
    transition: all 0.15s;
    opacity: 0;
    display: none;
  }
  .pb-container.error .pb-button .pb-cross > path {
    opacity: 1;
  }
  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
      transform-origin: center center;
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
      transform-origin: center center;
    }
  }
`;

/**
 * A extended version of a progress button
 * @returns {Component} The button component
 */
class Button extends React.PureComponent {
  render = () => {
    return (
      <ButtonWrapper height={this.props.height || "2rem"}>
        <ProgressButton {...this.props} />
      </ButtonWrapper>
    );
  };
}

export default Button;
