import React from "react";
import PropTypes from "prop-types";
import { Collapse } from "react-collapse";

import Link from "../components/Link";

/**
 * Renders an uncontrolled, animated collapse component
 * @returns {Component} The component
 */
class UncontrolledCollapse extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpenDefault || false
    };
  }
  render = () => {
    const { openLink, closeLink } = this.props;
    const { isOpen } = this.state;

    return (
      <div>
        <Collapse isOpened={isOpen}>{this.props.children}</Collapse>
        <Link
          styled
          onClick={() => {
            this.setState({ isOpen: !isOpen });
          }}
        >
          {isOpen ? closeLink : openLink}
        </Link>
      </div>
    );
  };
}

UncontrolledCollapse.propTypes = {
  openLink: PropTypes.node,
  closeLink: PropTypes.node,
  children: PropTypes.node,
  isOpenDefault: PropTypes.bool
};

export default UncontrolledCollapse;
