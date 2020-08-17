import React from "react";

/**
 * Allows adding a key to a component
 * @returns {Component} The component
 */
class Keyer extends React.PureComponent {
  render = () => this.props.children;
}
export default Keyer;
