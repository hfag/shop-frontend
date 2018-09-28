import React from "react";
import styled from "styled-components";
import ChevronDown from "react-icons/lib/fa/chevron-down";

import Card from "./Card";

const StyledOverflowCard = styled(Card)`
  position: relative;
  max-height: ${({ maxHeight, open }) => (open ? "none" : maxHeight || 20)}rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const More = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${({ maxHeight }) => maxHeight / 3 || 7}rem;

  cursor: pointer;

  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 1)
  );
`;

const Icon = styled(ChevronDown)`
  position: absolute;
  left: 50%;
  bottom: 1rem;

  transform: translateY(-50%);
`;

/**
 * Renders a card but only to a specific height
 * @returns {Component} The overflow card component
 */
class OverflowCard extends React.PureComponent {
  constructor() {
    super();
    this.state = { open: false };
  }
  render = () => {
    const { open } = this.state;
    return (
      <StyledOverflowCard {...this.props} open={open}>
        {this.props.children}
        {!open && (
          <More onClick={() => this.setState({ open: true })}>
            <Icon />
          </More>
        )}
      </StyledOverflowCard>
    );
  };
}

export default OverflowCard;
